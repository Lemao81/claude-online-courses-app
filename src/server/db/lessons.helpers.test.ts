import { asc, eq } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { outlineChangedMessage } from '#/constants/error.messages'
import { setLessonOrder } from '#/server/db/lessons.helpers'
import { chapters, courses, lessons } from '#/server/db/schema'
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

async function selectChapterDuration(tx: Transaction, chapterId: number): Promise<number> {
  const [chapter] = await tx
    .select({ durationSec: chapters.durationSec })
    .from(chapters)
    .where(eq(chapters.id, chapterId))

  return chapter.durationSec
}

async function selectCourseDuration(tx: Transaction, courseId: number): Promise<number> {
  const [course] = await tx
    .select({ durationSec: courses.durationSec })
    .from(courses)
    .where(eq(courses.id, courseId))

  return course.durationSec
}

describe('setLessonOrder', () => {
  it('rewrites positions at course level', () =>
    withRollback(async (tx) => {
      const { id: courseId } = await insertCourse(tx)
      const a = await insertLesson(tx, { courseId, title: 'A', position: 0 })
      const b = await insertLesson(tx, { courseId, title: 'B', position: 3 })
      const c = await insertLesson(tx, { courseId, title: 'C', position: 7 })

      await setLessonOrder(tx, courseId, [{ chapterId: null, lessonIds: [c.id, a.id, b.id] }])

      expect(await selectLessons(tx, courseId)).toEqual([
        { title: 'A', chapterId: null, position: 1 },
        { title: 'B', chapterId: null, position: 2 },
        { title: 'C', chapterId: null, position: 0 },
      ])
    }))

  it('rewrites positions in a chapter', () =>
    withRollback(async (tx) => {
      const { id: courseId } = await insertCourse(tx)
      const chapter = await insertChapter(tx, { courseId })

      await insertLesson(tx, { courseId, title: 'X', position: 5 })

      const a = await insertLesson(tx, { courseId, chapterId: chapter.id, title: 'A', position: 0 })
      const b = await insertLesson(tx, { courseId, chapterId: chapter.id, title: 'B', position: 1 })

      await setLessonOrder(tx, courseId, [{ chapterId: chapter.id, lessonIds: [b.id, a.id] }])

      expect(await selectLessons(tx, courseId)).toEqual([
        { title: 'X', chapterId: null, position: 5 },
        { title: 'A', chapterId: chapter.id, position: 1 },
        { title: 'B', chapterId: chapter.id, position: 0 },
      ])
    }))

  it('re-parents a lesson', () =>
    withRollback(async (tx) => {
      const { id: courseId } = await insertCourse(tx)
      const chapter = await insertChapter(tx, { courseId })
      const a = await insertLesson(tx, { courseId, title: 'A', position: 0 })
      const b = await insertLesson(tx, { courseId, title: 'B', position: 1 })
      const c = await insertLesson(tx, { courseId, chapterId: chapter.id, title: 'C', position: 0 })

      await setLessonOrder(tx, courseId, [
        { chapterId: null, lessonIds: [b.id] },
        { chapterId: chapter.id, lessonIds: [c.id, a.id] },
      ])

      expect(await selectLessons(tx, courseId)).toEqual([
        { title: 'A', chapterId: chapter.id, position: 1 },
        { title: 'B', chapterId: null, position: 0 },
        { title: 'C', chapterId: chapter.id, position: 0 },
      ])
    }))

  it('recomputes durations', () =>
    withRollback(async (tx) => {
      const { id: courseId } = await insertCourse(tx)
      const chapter = await insertChapter(tx, { courseId })
      const a = await insertLesson(tx, { courseId, title: 'A', durationSec: 60 })
      const b = await insertLesson(tx, {
        courseId,
        chapterId: chapter.id,
        title: 'B',
        durationSec: 30,
      })

      await setLessonOrder(tx, courseId, [
        { chapterId: null, lessonIds: [] },
        { chapterId: chapter.id, lessonIds: [b.id, a.id] },
      ])

      expect(await selectChapterDuration(tx, chapter.id)).toBe(90)
      expect(await selectCourseDuration(tx, courseId)).toBe(90)
    }))

  it('rejects a missing lesson', () =>
    withRollback(async (tx) => {
      const { id: courseId } = await insertCourse(tx)
      const a = await insertLesson(tx, { courseId, title: 'A', position: 0 })

      await insertLesson(tx, { courseId, title: 'B', position: 1 })

      await expect(
        setLessonOrder(tx, courseId, [{ chapterId: null, lessonIds: [a.id] }]),
      ).rejects.toThrow(outlineChangedMessage)
      expect(await selectLessons(tx, courseId)).toEqual([
        { title: 'A', chapterId: null, position: 0 },
        { title: 'B', chapterId: null, position: 1 },
      ])
    }))

  it('rejects a lesson from an unnamed parent', () =>
    withRollback(async (tx) => {
      const { id: courseId } = await insertCourse(tx)
      const chapter = await insertChapter(tx, { courseId })
      const a = await insertLesson(tx, { courseId, title: 'A', position: 0 })
      const b = await insertLesson(tx, { courseId, chapterId: chapter.id, title: 'B', position: 0 })

      await expect(
        setLessonOrder(tx, courseId, [{ chapterId: chapter.id, lessonIds: [b.id, a.id] }]),
      ).rejects.toThrow(outlineChangedMessage)
      expect(await selectLessons(tx, courseId)).toEqual([
        { title: 'A', chapterId: null, position: 0 },
        { title: 'B', chapterId: chapter.id, position: 0 },
      ])
    }))

  it('rejects a foreign lesson', () =>
    withRollback(async (tx) => {
      const { id: courseId } = await insertCourse(tx)
      const { id: otherCourseId } = await insertCourse(tx)
      const a = await insertLesson(tx, { courseId, title: 'A', position: 0 })
      const b = await insertLesson(tx, { courseId: otherCourseId, title: 'B', position: 0 })

      await expect(
        setLessonOrder(tx, courseId, [{ chapterId: null, lessonIds: [b.id, a.id] }]),
      ).rejects.toThrow(outlineChangedMessage)
      expect(await selectLessons(tx, courseId)).toEqual([
        { title: 'A', chapterId: null, position: 0 },
      ])
    }))

  it('rejects a duplicate lesson', () =>
    withRollback(async (tx) => {
      const { id: courseId } = await insertCourse(tx)
      const a = await insertLesson(tx, { courseId, title: 'A', position: 0 })

      await insertLesson(tx, { courseId, title: 'B', position: 1 })

      await expect(
        setLessonOrder(tx, courseId, [{ chapterId: null, lessonIds: [a.id, a.id] }]),
      ).rejects.toThrow(outlineChangedMessage)
    }))

  it('rejects a foreign chapter', () =>
    withRollback(async (tx) => {
      const { id: courseId } = await insertCourse(tx)
      const { id: otherCourseId } = await insertCourse(tx)
      const chapter = await insertChapter(tx, { courseId: otherCourseId })
      const a = await insertLesson(tx, { courseId, title: 'A', position: 0 })

      await expect(
        setLessonOrder(tx, courseId, [{ chapterId: chapter.id, lessonIds: [a.id] }]),
      ).rejects.toThrow(outlineChangedMessage)
      expect(await selectLessons(tx, courseId)).toEqual([
        { title: 'A', chapterId: null, position: 0 },
      ])
    }))

  it('rejects a repeated parent', () =>
    withRollback(async (tx) => {
      const { id: courseId } = await insertCourse(tx)
      const a = await insertLesson(tx, { courseId, title: 'A', position: 0 })
      const b = await insertLesson(tx, { courseId, title: 'B', position: 1 })

      await expect(
        setLessonOrder(tx, courseId, [
          { chapterId: null, lessonIds: [a.id] },
          { chapterId: null, lessonIds: [b.id] },
        ]),
      ).rejects.toThrow(outlineChangedMessage)
    }))
})
