import { eq, inArray } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { removeCourse, replaceCourseThumbnail } from '@/server/db/courses-helpers'
import { assets, courses, lessons } from '@/server/db/schema'
import type { Transaction } from '@/server/db/types'
import { withRollback } from '@/test/db'
import {
  insertAsset,
  insertChapter,
  insertCourse,
  insertEnrollment,
  insertLesson,
  insertUser,
} from '@/test/factories'

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

      await expect(removeCourse(tx, courseId)).rejects.toThrow('Only a draft course can be deleted')
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

describe('replaceCourseThumbnail', () => {
  it('sets the first thumbnail', () =>
    withRollback(async (tx) => {
      const ownerId = await insertUser(tx)
      const thumbnail = await insertAsset(tx, { ownerId, kind: 'image' })
      const { id: courseId } = await insertCourse(tx, { authorId: ownerId })

      const { course, replacedAssetId } = await replaceCourseThumbnail(tx, courseId, thumbnail.id)

      expect(course.thumbnailAssetId).toBe(thumbnail.id)
      expect(replacedAssetId).toBeNull()
    }))

  it('soft-deletes the replaced thumbnail', () =>
    withRollback(async (tx) => {
      const ownerId = await insertUser(tx)
      const oldThumbnail = await insertAsset(tx, { ownerId, kind: 'image' })
      const newThumbnail = await insertAsset(tx, { ownerId, kind: 'image' })
      const { id: courseId } = await insertCourse(tx, {
        authorId: ownerId,
        thumbnailAssetId: oldThumbnail.id,
      })

      const { course, replacedAssetId } = await replaceCourseThumbnail(
        tx,
        courseId,
        newThumbnail.id,
      )

      const thumbnails = await tx
        .select({ id: assets.id, deletedAt: assets.deletedAt })
        .from(assets)
        .where(inArray(assets.id, [oldThumbnail.id, newThumbnail.id]))

      expect(course.thumbnailAssetId).toBe(newThumbnail.id)
      expect(replacedAssetId).toBe(oldThumbnail.id)
      expect(thumbnails).toEqual(
        expect.arrayContaining([
          { id: oldThumbnail.id, deletedAt: expect.any(Date) },
          { id: newThumbnail.id, deletedAt: null },
        ]),
      )
    }))

  it('leaves other assets alone', () =>
    withRollback(async (tx) => {
      const ownerId = await insertUser(tx)
      const otherThumbnail = await insertAsset(tx, { ownerId, kind: 'image' })
      const video = await insertAsset(tx, { ownerId })
      const oldThumbnail = await insertAsset(tx, { ownerId, kind: 'image' })
      const newThumbnail = await insertAsset(tx, { ownerId, kind: 'image' })
      const { id: courseId } = await insertCourse(tx, {
        authorId: ownerId,
        thumbnailAssetId: oldThumbnail.id,
      })

      await insertCourse(tx, { authorId: ownerId, thumbnailAssetId: otherThumbnail.id })
      await insertLesson(tx, { courseId, videoAssetId: video.id })

      await replaceCourseThumbnail(tx, courseId, newThumbnail.id)

      const untouched = await tx
        .select({ id: assets.id, deletedAt: assets.deletedAt })
        .from(assets)
        .where(inArray(assets.id, [otherThumbnail.id, video.id]))

      expect(untouched).toEqual(
        expect.arrayContaining([
          { id: otherThumbnail.id, deletedAt: null },
          { id: video.id, deletedAt: null },
        ]),
      )
    }))

  it('rejects a missing course', () =>
    withRollback(async (tx) => {
      const ownerId = await insertUser(tx)
      const thumbnail = await insertAsset(tx, { ownerId, kind: 'image' })

      await expect(replaceCourseThumbnail(tx, -1, thumbnail.id)).rejects.toThrow(
        'The course no longer exists',
      )
    }))
})
