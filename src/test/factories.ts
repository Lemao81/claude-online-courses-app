import { chapters, courses, lessons, users } from '#/server/db/schema'
import type { Transaction } from '#/server/db/types'
import type { Chapter, Course, Lesson } from '#/types'

type CourseValues = Partial<typeof courses.$inferInsert>

type ChapterValues = Pick<Chapter, 'courseId'> & Partial<typeof chapters.$inferInsert>

type LessonValues = Pick<Lesson, 'courseId'> & Partial<typeof lessons.$inferInsert>

export async function insertUser(tx: Transaction): Promise<string> {
  const [user] = await tx
    .insert(users)
    .values({ id: `user_${crypto.randomUUID()}` })
    .returning({ id: users.id })

  return user.id
}

export async function insertCourse(tx: Transaction, values: CourseValues = {}): Promise<Course> {
  const [course] = await tx
    .insert(courses)
    .values({
      title: 'Course',
      subtitle: '',
      description: '',
      authorId: values.authorId ?? (await insertUser(tx)),
      ...values,
    })
    .returning()

  return course
}

export async function insertChapter(tx: Transaction, values: ChapterValues): Promise<Chapter> {
  const [chapter] = await tx
    .insert(chapters)
    .values({ title: 'Chapter', description: '', ...values })
    .returning()

  return chapter
}

export async function insertLesson(tx: Transaction, values: LessonValues): Promise<Lesson> {
  const [lesson] = await tx
    .insert(lessons)
    .values({ title: 'Lesson', ...values })
    .returning()

  return lesson
}
