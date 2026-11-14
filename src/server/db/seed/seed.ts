import { readFile } from 'node:fs/promises'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { eq, ne, sql } from 'drizzle-orm'
import { getTableConfig } from 'drizzle-orm/pg-core'
import { reset, seed } from 'drizzle-seed'
import { imageBucket, videoBucket } from '@/constants'
import { db } from '@/server/db/client'
import { assets, chapters, courses, lessons, users } from '@/server/db/schema'
import {
  type CourseSeed,
  courseSeeds,
  fillerCoursePrices,
  fillerCourseSubtitles,
  fillerCourseTitles,
  type LessonSeed,
} from '@/server/db/seed/seed-data'
import { attachThumbnail } from '@/server/db/thumbnails-helpers'
import type { Transaction } from '@/server/db/types'
import { fetchUserValues, type UserValues } from '@/server/db/users-helpers'
import { attachVideo } from '@/server/db/videos-helpers'
import { storageClient } from '@/server/storage/client'
import { ensureBucket, removeObject } from '@/server/storage/operations'
import type { CourseStatus } from '@/types'

const authorId = process.env.SEED_AUTHOR_ID

if (!authorId) {
  throw new Error('SEED_AUTHOR_ID is not set')
}

const seedVideo = { fileName: 'black-5s.mp4', contentType: 'video/mp4', width: 1280, height: 720 }

const seedThumbnailContentType = 'image/jpeg'

type LessonValues = typeof lessons.$inferInsert

type SeededLesson = {
  id: number
  durationSec: number
}

type SeededCourse = {
  title: string
  status: CourseStatus
  chapterCount: number
  lessonCount: number
}

function readSeedAsset(fileName: string): Promise<Buffer> {
  return readFile(new URL(`./assets/${fileName}`, import.meta.url))
}

function toObjectName(ownerId: string, courseId: number, extension: string): string {
  return `${ownerId}/${courseId}/${crypto.randomUUID()}.${extension}`
}

async function putObject(
  bucket: string,
  objectName: string,
  body: Buffer,
  contentType: string,
): Promise<void> {
  await ensureBucket(bucket)
  await storageClient.send(
    new PutObjectCommand({ Bucket: bucket, Key: objectName, Body: body, ContentType: contentType }),
  )
}

async function loadAuthorValues(ownerId: string): Promise<UserValues | null> {
  try {
    return await fetchUserValues(ownerId)
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)

    console.warn(`Could not load ${ownerId} from Clerk (${reason}), seeding it without a profile`)

    return null
  }
}

async function ensureAuthor(ownerId: string): Promise<boolean> {
  const values = await loadAuthorValues(ownerId)

  if (!values) {
    await db.insert(users).values({ id: ownerId }).onConflictDoNothing()

    return false
  }

  const { id, ...profile } = values

  await db.insert(users).values(values).onConflictDoUpdate({ target: users.id, set: profile })

  return true
}

async function removeStoredObjects(): Promise<number> {
  const stored = await db
    .select({ bucket: assets.bucket, objectName: assets.objectName })
    .from(assets)

  for (const object of stored) {
    await removeObject(object.bucket, object.objectName)
  }

  return stored.length
}

async function seedFillerCourses(): Promise<void> {
  await seed(db, { courses }, { seed: 1 }).refine((funcs) => ({
    courses: {
      count: fillerCourseTitles.length,
      columns: {
        authorId: funcs.default({ defaultValue: authorId }),
        title: funcs.valuesFromArray({ values: fillerCourseTitles, isUnique: true }),
        subtitle: funcs.valuesFromArray({ values: fillerCourseSubtitles }),
        description: funcs.loremIpsum({ sentencesCount: 3 }),
        status: funcs.valuesFromArray({
          values: [
            { weight: 0.7, values: ['published'] },
            { weight: 0.2, values: ['draft'] },
            { weight: 0.1, values: ['archived'] },
          ],
        }),
        publishedAt: funcs.date({ minDate: '2025-06-01', maxDate: '2026-07-01' }),
        thumbnailAssetId: funcs.default({ defaultValue: null }),
        price: funcs.valuesFromArray({ values: fillerCoursePrices }),
        rating: funcs.number({ minValue: 3.5, maxValue: 5, precision: 100 }),
        ratingCount: funcs.int({ minValue: 4, maxValue: 240 }),
        durationSec: funcs.int({ minValue: 1800, maxValue: 21600 }),
        createdAt: funcs.date({ minDate: '2025-05-01', maxDate: '2026-06-01' }),
        updatedAt: funcs.date({ minDate: '2026-06-01', maxDate: '2026-08-01' }),
      },
    },
  }))
}

async function clearUnpublishedDates(): Promise<void> {
  await db.update(courses).set({ publishedAt: null }).where(ne(courses.status, 'published'))
}

async function resyncCourseIds(): Promise<void> {
  const { schema: courseSchema, name } = getTableConfig(courses)
  const qualifiedName = `${courseSchema ?? 'public'}.${name}`

  await db.execute(
    sql`SELECT setval(pg_get_serial_sequence(${qualifiedName}, 'id'), (SELECT COALESCE(MAX(${courses.id}), 1) FROM ${courses}))`,
  )
}

function toLessonValues(
  courseId: number,
  chapterId: number | null,
  lessonSeeds: LessonSeed[],
): LessonValues[] {
  return lessonSeeds.map((lesson, index) => ({
    courseId,
    chapterId,
    position: index,
    title: lesson.title,
    durationSec: lesson.durationSec,
    isFreePreview: lesson.isFreePreview ?? false,
  }))
}

async function insertLessons(tx: Transaction, values: LessonValues[]): Promise<SeededLesson[]> {
  if (values.length === 0) {
    return []
  }

  return tx
    .insert(lessons)
    .values(values)
    .returning({ id: lessons.id, durationSec: lessons.durationSec })
}

async function insertOutline(
  tx: Transaction,
  courseId: number,
  courseSeed: CourseSeed,
): Promise<SeededLesson[]> {
  const courseLessons = await insertLessons(tx, toLessonValues(courseId, null, courseSeed.lessons))

  const insertedChapters = await tx
    .insert(chapters)
    .values(
      courseSeed.chapters.map((chapter, index) => ({
        courseId,
        position: index,
        title: chapter.title,
        description: chapter.description,
      })),
    )
    .returning({ id: chapters.id, position: chapters.position })

  const chapterLessons = await insertLessons(
    tx,
    insertedChapters.flatMap((c) =>
      toLessonValues(courseId, c.id, courseSeed.chapters[c.position].lessons),
    ),
  )

  return [...courseLessons, ...chapterLessons]
}

async function attachSeedVideos(
  tx: Transaction,
  ownerId: string,
  courseId: number,
  seededLessons: SeededLesson[],
  video: Buffer,
): Promise<void> {
  for (const lesson of seededLessons) {
    const objectName = toObjectName(ownerId, courseId, 'mp4')

    await putObject(videoBucket, objectName, video, seedVideo.contentType)
    await attachVideo(tx, {
      ownerId,
      courseId,
      lessonId: lesson.id,
      objectName,
      durationSec: lesson.durationSec,
      width: seedVideo.width,
      height: seedVideo.height,
    })
  }
}

async function attachSeedThumbnail(
  tx: Transaction,
  ownerId: string,
  courseId: number,
  thumbnail: Buffer,
): Promise<void> {
  const objectName = toObjectName(ownerId, courseId, 'jpg')

  await putObject(imageBucket, objectName, thumbnail, seedThumbnailContentType)
  await attachThumbnail(tx, { ownerId, courseId, objectName })
}

async function seedCourse(
  ownerId: string,
  courseSeed: CourseSeed,
  video: Buffer,
): Promise<SeededCourse> {
  const thumbnail = await readSeedAsset(courseSeed.thumbnailFile)

  return db.transaction(async (tx) => {
    const [course] = await tx
      .insert(courses)
      .values({
        authorId: ownerId,
        title: courseSeed.title,
        subtitle: courseSeed.subtitle,
        description: courseSeed.description,
        status: courseSeed.status,
        publishedAt: courseSeed.publishedAt,
        price: courseSeed.price,
        rating: courseSeed.rating,
        ratingCount: courseSeed.ratingCount,
        createdAt: courseSeed.createdAt,
        updatedAt: courseSeed.updatedAt,
      })
      .returning({ id: courses.id })

    const seededLessons = await insertOutline(tx, course.id, courseSeed)

    await attachSeedVideos(tx, ownerId, course.id, seededLessons, video)
    await attachSeedThumbnail(tx, ownerId, course.id, thumbnail)
    await tx
      .update(courses)
      .set({ updatedAt: courseSeed.updatedAt })
      .where(eq(courses.id, course.id))

    return {
      title: courseSeed.title,
      status: courseSeed.status,
      chapterCount: courseSeed.chapters.length,
      lessonCount: seededLessons.length,
    }
  })
}

async function seedDatabase(ownerId: string): Promise<void> {
  const hasProfile = await ensureAuthor(ownerId)

  console.log(`Ensured author ${ownerId} ${hasProfile ? 'with' : 'without'} a Clerk profile`)

  const removedObjectCount = await removeStoredObjects()

  await reset(db, { courses, assets })
  await seedFillerCourses()
  await clearUnpublishedDates()
  await resyncCourseIds()

  console.log(`Removed ${removedObjectCount} stored objects of earlier assets`)
  console.log(`Seeded ${fillerCourseTitles.length} filler courses for ${ownerId}`)

  const video = await readSeedAsset(seedVideo.fileName)

  for (const courseSeed of courseSeeds) {
    const { title, status, chapterCount, lessonCount } = await seedCourse(
      ownerId,
      courseSeed,
      video,
    )

    console.log(
      `Seeded ${status} course "${title}" with ${chapterCount} chapters, ${lessonCount} lessons and a thumbnail`,
    )
  }
}

await seedDatabase(authorId)
await db.$client.end()
