import { asc, eq } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { outlineChangedMessage } from '#/constants/error.messages'
import { removeChapter, setChapterOrder } from '#/server/db/chapters.helpers'
import { chapters, lessons } from '#/server/db/schema'
import type { Transaction } from '#/server/db/types'
import { withRollback } from '#/test/db'
import { insertChapter, insertCourse, insertLesson } from '#/test/factories'
import type { Chapter, Lesson } from '#/types'

type LessonPlacement = Pick<Lesson, 'title' | 'chapterId' | 'position'>

type ChapterPlacement = Pick<Chapter, 'title' | 'position'>

async function selectLessons(tx: Transaction, courseId: number): Promise<LessonPlacement[]> {
  return tx
    .select({ title: lessons.title, chapterId: lessons.chapterId, position: lessons.position })
    .from(lessons)
    .where(eq(lessons.courseId, courseId))
    .orderBy(asc(lessons.id))
}

async function selectChapters(tx: Transaction, courseId: number): Promise<ChapterPlacement[]> {
  return tx
    .select({ title: chapters.title, position: chapters.position })
    .from(chapters)
    .where(eq(chapters.courseId, courseId))
    .orderBy(asc(chapters.id))
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

describe('setChapterOrder', () => {
  it('rewrites positions', () =>
    withRollback(async (tx) => {
      const { id: courseId } = await insertCourse(tx)
      const a = await insertChapter(tx, { courseId, title: 'A', position: 0 })
      const b = await insertChapter(tx, { courseId, title: 'B', position: 3 })
      const c = await insertChapter(tx, { courseId, title: 'C', position: 7 })

      await setChapterOrder(tx, courseId, [c.id, a.id, b.id])

      expect(await selectChapters(tx, courseId)).toEqual([
        { title: 'A', position: 1 },
        { title: 'B', position: 2 },
        { title: 'C', position: 0 },
      ])
    }))

  it('rejects a missing chapter', () =>
    withRollback(async (tx) => {
      const { id: courseId } = await insertCourse(tx)
      const a = await insertChapter(tx, { courseId, title: 'A', position: 0 })

      await insertChapter(tx, { courseId, title: 'B', position: 1 })

      await expect(setChapterOrder(tx, courseId, [a.id])).rejects.toThrow(outlineChangedMessage)
      expect(await selectChapters(tx, courseId)).toEqual([
        { title: 'A', position: 0 },
        { title: 'B', position: 1 },
      ])
    }))

  it('rejects a foreign chapter', () =>
    withRollback(async (tx) => {
      const { id: courseId } = await insertCourse(tx)
      const { id: otherCourseId } = await insertCourse(tx)
      const a = await insertChapter(tx, { courseId, title: 'A', position: 0 })
      const b = await insertChapter(tx, { courseId: otherCourseId, title: 'B', position: 0 })

      await expect(setChapterOrder(tx, courseId, [b.id, a.id])).rejects.toThrow(
        outlineChangedMessage,
      )
      expect(await selectChapters(tx, courseId)).toEqual([{ title: 'A', position: 0 }])
    }))

  it('rejects a duplicate chapter', () =>
    withRollback(async (tx) => {
      const { id: courseId } = await insertCourse(tx)
      const a = await insertChapter(tx, { courseId, title: 'A', position: 0 })

      await insertChapter(tx, { courseId, title: 'B', position: 1 })

      await expect(setChapterOrder(tx, courseId, [a.id, a.id])).rejects.toThrow(
        outlineChangedMessage,
      )
    }))
})
