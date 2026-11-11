import { and, asc, eq, inArray, isNotNull, isNull } from 'drizzle-orm'
import { assets, chapters, courses, enrollments, lessons } from '@/server/db/schema'
import type { Database, Transaction } from '@/server/db/types'
import type { AssetStatus, Course, CourseOutline, CourseStatus, LessonVideo } from '@/types'
import { getCourseReadiness, isCourseReady } from '@/utils/readiness-helpers'

export type ThumbnailReplacement = {
  course: Course
  replacedAssetId: number | null
}

type OutlineLessonRow = Omit<LessonVideo, 'videoStatus'> & {
  videoAsset: { status: AssetStatus } | null
}

function toLessonVideo({ videoAsset, ...lesson }: OutlineLessonRow): LessonVideo {
  return { ...lesson, videoStatus: videoAsset?.status ?? null }
}

export async function selectOutlineLessons(
  database: Database,
  courseId: number,
): Promise<Pick<CourseOutline, 'lessons' | 'chapters'>> {
  const course = await database.query.courses.findFirst({
    where: eq(courses.id, courseId),
    columns: { id: true },
    with: {
      lessons: {
        columns: { id: true, title: true, durationSec: true },
        where: isNull(lessons.chapterId),
        orderBy: asc(lessons.position),
        with: { videoAsset: { columns: { status: true } } },
      },
      chapters: {
        orderBy: asc(chapters.position),
        with: {
          lessons: {
            columns: { id: true, title: true, durationSec: true },
            orderBy: asc(lessons.position),
            with: { videoAsset: { columns: { status: true } } },
          },
        },
      },
    },
  })

  if (!course) {
    throw new Error('The course no longer exists')
  }

  return {
    lessons: course.lessons.map(toLessonVideo),
    chapters: course.chapters.map((c) => ({ ...c, lessons: c.lessons.map(toLessonVideo) })),
  }
}

async function lockCourseStatus(tx: Transaction, courseId: number): Promise<CourseStatus> {
  const [course] = await tx
    .select({ status: courses.status })
    .from(courses)
    .where(eq(courses.id, courseId))
    .for('update')

  if (!course) {
    throw new Error('The course no longer exists')
  }

  return course.status
}

export async function setCoursePublished(tx: Transaction, courseId: number): Promise<Course> {
  const status = await lockCourseStatus(tx, courseId)

  if (status !== 'draft') {
    throw new Error('Only a draft course can be published')
  }

  const readiness = getCourseReadiness(await selectOutlineLessons(tx, courseId))

  if (!readiness.hasLessons) {
    throw new Error('Add a lesson before publishing')
  }

  if (!isCourseReady(readiness)) {
    throw new Error('Every lesson needs a ready video before publishing')
  }

  const [course] = await tx
    .update(courses)
    .set({ status: 'published', publishedAt: new Date() })
    .where(eq(courses.id, courseId))
    .returning()

  return course
}

export async function setCourseDraft(tx: Transaction, courseId: number): Promise<Course> {
  const status = await lockCourseStatus(tx, courseId)

  if (status !== 'published') {
    throw new Error('Only a published course can be unpublished')
  }

  const [course] = await tx
    .update(courses)
    .set({ status: 'draft' })
    .where(eq(courses.id, courseId))
    .returning()

  return course
}

export async function setCourseArchived(tx: Transaction, courseId: number): Promise<Course> {
  const status = await lockCourseStatus(tx, courseId)

  if (status === 'archived') {
    throw new Error('The course is already archived')
  }

  const [course] = await tx
    .update(courses)
    .set({ status: 'archived' })
    .where(eq(courses.id, courseId))
    .returning()

  return course
}

export async function removeCourse(tx: Transaction, courseId: number): Promise<number[]> {
  const [course] = await tx
    .select({ status: courses.status, thumbnailAssetId: courses.thumbnailAssetId })
    .from(courses)
    .where(eq(courses.id, courseId))
    .for('update')

  if (!course) {
    throw new Error('The course no longer exists')
  }

  if (course.status !== 'draft') {
    throw new Error('Only a draft course can be deleted')
  }

  const [enrollment] = await tx
    .select({ id: enrollments.id })
    .from(enrollments)
    .where(eq(enrollments.courseId, courseId))
    .limit(1)

  if (enrollment) {
    throw new Error('A course with enrollments cannot be deleted')
  }

  const videos = await tx
    .select({ assetId: lessons.videoAssetId })
    .from(lessons)
    .where(and(eq(lessons.courseId, courseId), isNotNull(lessons.videoAssetId)))

  const assetIds = [course.thumbnailAssetId, ...videos.map((v) => v.assetId)].filter(
    (id): id is number => id !== null,
  )

  await tx.delete(courses).where(eq(courses.id, courseId))

  if (assetIds.length > 0) {
    await tx.update(assets).set({ deletedAt: new Date() }).where(inArray(assets.id, assetIds))
  }

  return assetIds
}

export async function replaceCourseThumbnail(
  tx: Transaction,
  courseId: number,
  assetId: number,
): Promise<ThumbnailReplacement> {
  const [course] = await tx
    .select({ thumbnailAssetId: courses.thumbnailAssetId })
    .from(courses)
    .where(eq(courses.id, courseId))
    .for('update')

  if (!course) {
    throw new Error('The course no longer exists')
  }

  const [updated] = await tx
    .update(courses)
    .set({ thumbnailAssetId: assetId })
    .where(eq(courses.id, courseId))
    .returning()

  const replacedAssetId = course.thumbnailAssetId

  if (replacedAssetId !== null) {
    await tx.update(assets).set({ deletedAt: new Date() }).where(eq(assets.id, replacedAssetId))
  }

  return { course: updated, replacedAssetId }
}
