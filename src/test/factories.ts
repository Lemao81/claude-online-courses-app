import { assets, chapters, courses, enrollments, lessons, users } from '@/server/db/schema'
import type { Database } from '@/server/types'
import type { Asset, Chapter, Course, Enrollment, Lesson } from '@/types'

type CourseValues = Partial<typeof courses.$inferInsert>

type ChapterValues = Pick<Chapter, 'courseId'> & Partial<typeof chapters.$inferInsert>

type LessonValues = Pick<Lesson, 'courseId'> & Partial<typeof lessons.$inferInsert>

type AssetValues = Pick<Asset, 'ownerId'> & Partial<typeof assets.$inferInsert>

type EnrollmentValues = Pick<Enrollment, 'courseId'> & Partial<typeof enrollments.$inferInsert>

export async function insertUser(
  database: Database,
  id = `user_${crypto.randomUUID()}`,
): Promise<string> {
  const [user] = await database.insert(users).values({ id }).returning({ id: users.id })

  return user.id
}

export async function insertCourse(database: Database, values: CourseValues = {}): Promise<Course> {
  const [course] = await database
    .insert(courses)
    .values({
      title: 'Course',
      subtitle: 'Subtitle',
      description: '',
      authorId: values.authorId ?? (await insertUser(database)),
      ...values,
    })
    .returning()

  return course
}

export async function insertChapter(database: Database, values: ChapterValues): Promise<Chapter> {
  const [chapter] = await database
    .insert(chapters)
    .values({ title: 'Chapter', description: '', ...values })
    .returning()

  return chapter
}

export async function insertLesson(database: Database, values: LessonValues): Promise<Lesson> {
  const [lesson] = await database
    .insert(lessons)
    .values({ title: 'Lesson', ...values })
    .returning()

  return lesson
}

export async function insertAsset(database: Database, values: AssetValues): Promise<Asset> {
  const [asset] = await database
    .insert(assets)
    .values({
      kind: 'video',
      bucket: 'test',
      objectName: crypto.randomUUID(),
      contentType: 'video/mp4',
      ...values,
    })
    .returning()

  return asset
}

export async function insertEnrollment(
  database: Database,
  values: EnrollmentValues,
): Promise<Enrollment> {
  const [enrollment] = await database
    .insert(enrollments)
    .values({ pricePaid: '0', userId: values.userId ?? (await insertUser(database)), ...values })
    .returning()

  return enrollment
}
