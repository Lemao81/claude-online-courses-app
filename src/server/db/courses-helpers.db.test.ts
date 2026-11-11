import { eq, inArray } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import {
  removeCourse,
  replaceCourseThumbnail,
  setCourseArchived,
  setCourseDraft,
  setCoursePublished,
} from '@/server/db/courses-helpers'
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
import type { AssetStatus, Course, CourseStatus } from '@/types'

async function selectCourseIds(tx: Transaction, courseId: number): Promise<{ id: number }[]> {
  return tx.select({ id: courses.id }).from(courses).where(eq(courses.id, courseId))
}

async function selectCourseStatus(tx: Transaction, courseId: number): Promise<CourseStatus> {
  const [course] = await tx
    .select({ status: courses.status })
    .from(courses)
    .where(eq(courses.id, courseId))

  return course.status
}

async function insertVideoLesson(
  tx: Transaction,
  course: Pick<Course, 'id' | 'authorId'>,
  status: AssetStatus = 'ready',
  chapterId: number | null = null,
): Promise<void> {
  const video = await insertAsset(tx, { ownerId: course.authorId, status })

  await insertLesson(tx, { courseId: course.id, chapterId, videoAssetId: video.id })
}

async function insertPublishedCourse(tx: Transaction): Promise<Course> {
  return insertCourse(tx, { status: 'published', publishedAt: new Date('2026-01-01') })
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

describe('setCoursePublished', () => {
  it('publishes a draft whose every lesson has a ready video', () =>
    withRollback(async (tx) => {
      const draft = await insertCourse(tx)
      const chapter = await insertChapter(tx, { courseId: draft.id })

      await insertVideoLesson(tx, draft)
      await insertVideoLesson(tx, draft, 'ready', chapter.id)

      const course = await setCoursePublished(tx, draft.id)

      expect(course.status).toBe('published')
      expect(course.publishedAt).toEqual(expect.any(Date))
    }))

  it('sets publishedAt again when a course returns', () =>
    withRollback(async (tx) => {
      const previous = new Date('2026-01-01')
      const draft = await insertCourse(tx, { publishedAt: previous })

      await insertVideoLesson(tx, draft)

      const course = await setCoursePublished(tx, draft.id)

      expect(course.publishedAt?.getTime()).toBeGreaterThan(previous.getTime())
    }))

  it('rejects a course without lessons', () =>
    withRollback(async (tx) => {
      const draft = await insertCourse(tx)

      await insertChapter(tx, { courseId: draft.id })

      await expect(setCoursePublished(tx, draft.id)).rejects.toThrow(
        'Add a lesson before publishing',
      )

      expect(await selectCourseStatus(tx, draft.id)).toBe('draft')
    }))

  it('rejects a lesson without a video', () =>
    withRollback(async (tx) => {
      const draft = await insertCourse(tx)

      await insertVideoLesson(tx, draft)
      await insertLesson(tx, { courseId: draft.id })

      await expect(setCoursePublished(tx, draft.id)).rejects.toThrow(
        'Every lesson needs a ready video before publishing',
      )

      expect(await selectCourseStatus(tx, draft.id)).toBe('draft')
    }))

  it('rejects a chapter lesson whose video is not ready', () =>
    withRollback(async (tx) => {
      const draft = await insertCourse(tx)
      const chapter = await insertChapter(tx, { courseId: draft.id })

      await insertVideoLesson(tx, draft)
      await insertVideoLesson(tx, draft, 'pending', chapter.id)

      await expect(setCoursePublished(tx, draft.id)).rejects.toThrow(
        'Every lesson needs a ready video before publishing',
      )
    }))

  it('rejects a published course', () =>
    withRollback(async (tx) => {
      const published = await insertPublishedCourse(tx)

      await insertVideoLesson(tx, published)

      await expect(setCoursePublished(tx, published.id)).rejects.toThrow(
        'Only a draft course can be published',
      )
    }))

  it('rejects an archived course', () =>
    withRollback(async (tx) => {
      const archived = await insertCourse(tx, { status: 'archived' })

      await insertVideoLesson(tx, archived)

      await expect(setCoursePublished(tx, archived.id)).rejects.toThrow(
        'Only a draft course can be published',
      )
    }))

  it('rejects a missing course', () =>
    withRollback(async (tx) => {
      await expect(setCoursePublished(tx, -1)).rejects.toThrow('The course no longer exists')
    }))
})

describe('setCourseDraft', () => {
  it('returns a published course to draft, keeping publishedAt', () =>
    withRollback(async (tx) => {
      const published = await insertPublishedCourse(tx)

      const course = await setCourseDraft(tx, published.id)

      expect(course.status).toBe('draft')
      expect(course.publishedAt).toEqual(published.publishedAt)
    }))

  it('rejects a draft', () =>
    withRollback(async (tx) => {
      const draft = await insertCourse(tx)

      await expect(setCourseDraft(tx, draft.id)).rejects.toThrow(
        'Only a published course can be unpublished',
      )
    }))

  it('rejects an archived course', () =>
    withRollback(async (tx) => {
      const archived = await insertCourse(tx, { status: 'archived' })

      await expect(setCourseDraft(tx, archived.id)).rejects.toThrow(
        'Only a published course can be unpublished',
      )

      expect(await selectCourseStatus(tx, archived.id)).toBe('archived')
    }))
})

describe('setCourseArchived', () => {
  it('archives a draft', () =>
    withRollback(async (tx) => {
      const draft = await insertCourse(tx)

      const course = await setCourseArchived(tx, draft.id)

      expect(course.status).toBe('archived')
    }))

  it('archives a published course, keeping publishedAt', () =>
    withRollback(async (tx) => {
      const published = await insertPublishedCourse(tx)

      const course = await setCourseArchived(tx, published.id)

      expect(course.status).toBe('archived')
      expect(course.publishedAt).toEqual(published.publishedAt)
    }))

  it('rejects an archived course', () =>
    withRollback(async (tx) => {
      const archived = await insertCourse(tx, { status: 'archived' })

      await expect(setCourseArchived(tx, archived.id)).rejects.toThrow(
        'The course is already archived',
      )
    }))
})
