import { ne, sql } from 'drizzle-orm'
import { getTableConfig } from 'drizzle-orm/pg-core'
import { reset, seed } from 'drizzle-seed'
import { db } from '#/server/db/index'
import { courses } from '#/server/db/schema'

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

async function clearUnpublishedDates(): Promise<void> {
  await db
    .update(courses)
    .set({ publishedAt: null })
    .where(ne(courses.status, 'published'))
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

  console.log(`Seeded ${courseTitles.length} courses for ${authorId}`)
}

await seedDatabase()
await db.$client.end()
