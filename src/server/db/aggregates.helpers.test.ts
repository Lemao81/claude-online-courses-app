import { eq } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { recomputeCourseDuration } from '#/server/db/aggregates.helpers'
import { chapters, courses } from '#/server/db/schema'
import { withRollback } from '#/test/db'
import { insertChapter, insertCourse, insertLesson } from '#/test/factories'

describe('recomputeCourseDuration', () => {
  it('sums lesson durations', () =>
    withRollback(async (tx) => {
      const course = await insertCourse(tx)
      const chapter = await insertChapter(tx, { courseId: course.id })
      const emptyChapter = await insertChapter(tx, { courseId: course.id, durationSec: 99 })

      await insertLesson(tx, { courseId: course.id, chapterId: chapter.id, durationSec: 60 })
      await insertLesson(tx, { courseId: course.id, chapterId: chapter.id, durationSec: 30 })
      await insertLesson(tx, { courseId: course.id, durationSec: 15 })

      await recomputeCourseDuration(tx, course.id)

      const [{ durationSec }] = await tx
        .select({ durationSec: courses.durationSec })
        .from(courses)
        .where(eq(courses.id, course.id))

      const chapterDurations = await tx
        .select({ id: chapters.id, durationSec: chapters.durationSec })
        .from(chapters)
        .where(eq(chapters.courseId, course.id))

      expect(durationSec).toBe(105)
      expect(chapterDurations).toEqual(
        expect.arrayContaining([
          { id: chapter.id, durationSec: 90 },
          { id: emptyChapter.id, durationSec: 0 },
        ]),
      )
    }))
})
