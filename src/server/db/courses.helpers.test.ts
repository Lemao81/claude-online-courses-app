import { eq, inArray } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { removeCourse } from '#/server/db/courses.helpers'
import { assets, courses, lessons } from '#/server/db/schema'
import type { Transaction } from '#/server/db/types'
import { withRollback } from '#/test/db'
import {
  insertAsset,
  insertChapter,
  insertCourse,
  insertEnrollment,
  insertLesson,
  insertUser,
} from '#/test/factories'

async function selectCourseIds(tx: Transaction, courseId: number): Promise<{ id: number }[]> {
  return tx.select({ id: courses.id }).from(courses).where(eq(courses.id, courseId))
}

describe('removeCourse', () => {
  it('deletes the course', () =>
    withRollback(async (tx) => {
      const { id: courseId } = await insertCourse(tx)
      const chapter = await insertChapter(tx, { courseId })

      await insertLesson(tx, { courseId })
      await insertLesson(tx, { courseId, chapterId: chapter.id })

      await removeCourse(tx, courseId)

      const remainingLessons = await tx
        .select({ id: lessons.id })
        .from(lessons)
        .where(eq(lessons.courseId, courseId))

      expect(await selectCourseIds(tx, courseId)).toEqual([])
      expect(remainingLessons).toEqual([])
    }))

  it('soft-deletes its assets', () =>
    withRollback(async (tx) => {
      const ownerId = await insertUser(tx)
      const thumbnail = await insertAsset(tx, { ownerId, kind: 'image' })
      const video = await insertAsset(tx, { ownerId })
      const otherVideo = await insertAsset(tx, { ownerId })
      const { id: courseId } = await insertCourse(tx, {
        authorId: ownerId,
        thumbnailAssetId: thumbnail.id,
      })

      await insertLesson(tx, { courseId, videoAssetId: video.id })
      await insertLesson(tx, { courseId })

      const assetIds = await removeCourse(tx, courseId)

      const deleted = await tx
        .select({ id: assets.id, deletedAt: assets.deletedAt })
        .from(assets)
        .where(inArray(assets.id, [thumbnail.id, video.id, otherVideo.id]))

      expect(assetIds).toEqual([thumbnail.id, video.id])
      expect(deleted).toEqual(
        expect.arrayContaining([
          { id: thumbnail.id, deletedAt: expect.any(Date) },
          { id: video.id, deletedAt: expect.any(Date) },
          { id: otherVideo.id, deletedAt: null },
        ]),
      )
    }))

  it('rejects a published course', () =>
    withRollback(async (tx) => {
      const { id: courseId } = await insertCourse(tx, {
        status: 'published',
        publishedAt: new Date(),
      })

      await expect(removeCourse(tx, courseId)).rejects.toThrow(
        'Only a draft course can be deleted',
      )
      expect(await selectCourseIds(tx, courseId)).toEqual([{ id: courseId }])
    }))

  it('rejects an enrolled course', () =>
    withRollback(async (tx) => {
      const { id: courseId } = await insertCourse(tx)

      await insertEnrollment(tx, { courseId })

      await expect(removeCourse(tx, courseId)).rejects.toThrow(
        'A course with enrollments cannot be deleted',
      )
      expect(await selectCourseIds(tx, courseId)).toEqual([{ id: courseId }])
    }))
})
