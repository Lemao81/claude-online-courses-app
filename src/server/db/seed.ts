import { asc, ne, sql } from 'drizzle-orm'
import { getTableConfig } from 'drizzle-orm/pg-core'
import { reset, seed } from 'drizzle-seed'
import { db } from '#/server/db/index'
import { chapters, courses, lessons } from '#/server/db/schema'

const authorId = process.env.SEED_AUTHOR_ID

if (!authorId) {
  throw new Error('SEED_AUTHOR_ID is not set')
}

const courseTitles = [
  'TanStack Start from Scratch',
  'Type-Safe Data with Drizzle ORM',
  'React 19 Patterns in Practice',
  'Designing Interfaces with Chakra UI v3',
  'PostgreSQL for Application Developers',
  'Shipping Full-Stack Apps with Docker',
  'Testing React Applications with Vitest',
  'Authentication Flows with Clerk',
]

const courseSubtitles = [
  'A hands-on course built around a single real project',
  'From first principles to production-ready code',
  'Short lessons you can finish over a lunch break',
  'The concepts that come up in every code review',
  'Learn the tooling by rebuilding it yourself',
  'Practical recipes for everyday feature work',
  'Everything you need for your next side project',
  'A guided tour with exercises after every chapter',
]

const coursePrices = ['0', '19.00', '29.00', '39.00', '49.00', '79.00']

type LessonSeed = {
  title: string
  durationSec: number
  isFreePreview?: boolean
}

type ChapterSeed = {
  title: string
  description: string
  durationSec: number
  lessons: LessonSeed[]
}

const chapterSeeds: ChapterSeed[] = [
  {
    title: 'Course Overview',
    description: 'What the course covers, who it is for, and how the lessons are structured.',
    durationSec: 1260,
    lessons: [
      { title: 'Welcome and course goals', durationSec: 300, isFreePreview: true },
      { title: 'How the project is structured', durationSec: 420 },
      { title: 'Getting the most out of the exercises', durationSec: 540 },
    ],
  },
  {
    title: 'Setting Up Your Environment',
    description: 'Install the tooling, clone the starter project, and run it for the first time.',
    durationSec: 2040,
    lessons: [
      { title: 'Installing Node and pnpm', durationSec: 480, isFreePreview: true },
      { title: 'Cloning the starter project', durationSec: 360 },
      { title: 'Configuring environment variables', durationSec: 660 },
      { title: 'Running the dev server', durationSec: 540 },
    ],
  },
  {
    title: 'Building the First Feature',
    description: 'Work through a complete slice of the app, from the data layer up to the UI.',
    durationSec: 3480,
    lessons: [
      { title: 'Modelling the data', durationSec: 720 },
      { title: 'Writing the server function', durationSec: 900 },
      { title: 'Wiring up the route loader', durationSec: 840 },
      { title: 'Rendering the UI', durationSec: 1020 },
    ],
  },
  {
    title: 'Testing and Refactoring',
    description: 'Cover the feature with tests, then reshape the code without breaking it.',
    durationSec: 2700,
    lessons: [],
  },
  {
    title: 'Shipping to Production',
    description: 'Prepare a production build, configure the environment, and deploy it.',
    durationSec: 1920,
    lessons: [],
  },
]

async function seedCourses(): Promise<void> {
  await seed(db, { courses }, { seed: 1 }).refine((funcs) => ({
    courses: {
      count: courseTitles.length,
      columns: {
        authorId: funcs.default({ defaultValue: authorId }),
        title: funcs.valuesFromArray({ values: courseTitles, isUnique: true }),
        subtitle: funcs.valuesFromArray({ values: courseSubtitles }),
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
        price: funcs.valuesFromArray({ values: coursePrices }),
        rating: funcs.number({ minValue: 3.5, maxValue: 5, precision: 100 }),
        ratingCount: funcs.int({ minValue: 4, maxValue: 240 }),
        durationSec: funcs.int({ minValue: 1800, maxValue: 21600 }),
        createdAt: funcs.date({ minDate: '2025-05-01', maxDate: '2026-06-01' }),
        updatedAt: funcs.date({ minDate: '2026-06-01', maxDate: '2026-08-01' }),
      },
    },
  }))
}

async function seedChapters(): Promise<{ courseId: number; lessonCount: number }> {
  const [course] = await db
    .select({ id: courses.id })
    .from(courses)
    .orderBy(asc(courses.id))
    .limit(1)

  if (!course) {
    throw new Error('No seeded course to attach chapters to')
  }

  const insertedChapters = await db
    .insert(chapters)
    .values(
      chapterSeeds.map((chapter, index) => ({
        courseId: course.id,
        position: index,
        title: chapter.title,
        description: chapter.description,
        durationSec: chapter.durationSec,
      })),
    )
    .returning({ id: chapters.id, position: chapters.position })

  const lessonValues = insertedChapters.flatMap((chapter) =>
    chapterSeeds[chapter.position].lessons.map((lesson, index) => ({
      courseId: course.id,
      chapterId: chapter.id,
      position: index,
      title: lesson.title,
      durationSec: lesson.durationSec,
      isFreePreview: lesson.isFreePreview ?? false,
    })),
  )

  if (lessonValues.length > 0) {
    await db.insert(lessons).values(lessonValues)
  }

  return { courseId: course.id, lessonCount: lessonValues.length }
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

async function seedDatabase(): Promise<void> {
  await reset(db, { courses })
  await seedCourses()
  await clearUnpublishedDates()
  await resyncCourseIds()
  const { courseId, lessonCount } = await seedChapters()

  console.log(`Seeded ${courseTitles.length} courses for ${authorId}`)
  console.log(`Seeded ${chapterSeeds.length} chapters for course ${courseId}`)
  console.log(`Seeded ${lessonCount} lessons for course ${courseId}`)
}

await seedDatabase()
await db.$client.end()
