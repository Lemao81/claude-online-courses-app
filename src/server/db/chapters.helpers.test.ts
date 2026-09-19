import { asc, eq } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { removeChapter } from '#/server/db/chapters.helpers'
import { chapters, lessons } from '#/server/db/schema'
import type { Transaction } from '#/server/db/types'
import { withRollback } from '#/test/db'
import { insertChapter, insertCourse, insertLesson } from '#/test/factories'
import type { Lesson } from '#/types'

type LessonPlacement = Pick<Lesson, 'title' | 'chapterId' | 'position'>

async function selectLessons(tx: Transaction, courseId: number): Promise<LessonPlacement[]> {
  return tx
    .select({ title: lessons.title, chapterId: lessons.chapterId, position: lessons.position })
    .from(lessons)
    .where(eq(lessons.courseId, courseId))
    .orderBy(asc(lessons.id))
}

describe('removeChapter', () => {
  it('appends lessons to course level', () =>
    withRollback(async (tx) => {
      const { id: courseId } = await insertCourse(tx)
      const chapter = await insertChapter(tx, { courseId })
      const otherChapter = await insertChapter(tx, { courseId, position: 1 })

      await insertLesson(tx, { courseId, title: 'A', position: 0 })
      await insertLesson(tx, { courseId, title: 'B', position: 3 })
      await insertLesson(tx, { courseId, chapterId: chapter.id, title: 'D', position: 1 })
      await insertLesson(tx, { courseId, chapterId: chapter.id, title: 'C', position: 0 })
      await insertLesson(tx, { courseId, chapterId: otherChapter.id, title: 'E' })

      await removeChapter(tx, chapter)

      expect(await selectLessons(tx, courseId)).toEqual([
        { title: 'A', chapterId: null, position: 0 },
        { title: 'B', chapterId: null, position: 3 },
        { title: 'D', chapterId: null, position: 5 },
        { title: 'C', chapterId: null, position: 4 },
        { title: 'E', chapterId: otherChapter.id, position: 0 },
      ])
    }))

  it('starts at zero', () =>
    withRollback(async (tx) => {
      const { id: courseId } = await insertCourse(tx)
      const chapter = await insertChapter(tx, { courseId })

      await insertLesson(tx, { courseId, chapterId: chapter.id, title: 'A', position: 2 })

      await removeChapter(tx, chapter)

      expect(await selectLessons(tx, courseId)).toEqual([
        { title: 'A', chapterId: null, position: 0 },
      ])
    }))

  it('deletes the chapter', () =>
    withRollback(async (tx) => {
      const { id: courseId } = await insertCourse(tx)
      const chapter = await insertChapter(tx, { courseId })
      const otherChapter = await insertChapter(tx, { courseId, position: 1 })

      await removeChapter(tx, chapter)

      const remaining = await tx
        .select({ id: chapters.id })
        .from(chapters)
        .where(eq(chapters.courseId, courseId))

      expect(remaining).toEqual([{ id: otherChapter.id }])
    }))
})
