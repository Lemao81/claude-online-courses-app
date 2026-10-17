import { eq } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { videoBucket } from '@/constants'
import { assets, chapters, courses } from '@/server/db/schema'
import { attachVideo } from '@/server/db/videos-helpers'
import { minioClient } from '@/server/minio/client'
import { ensureBucket } from '@/server/minio/operations'
import { withRollback } from '@/test/db'
import {
  insertAsset,
  insertChapter,
  insertCourse,
  insertLesson,
  insertUser,
} from '@/test/factories'

const metadata = { durationSec: 90, width: 1920, height: 1080 }

function toObjectName(ownerId: string, courseId: number): string {
  return `${ownerId}/${courseId}/${crypto.randomUUID()}.mp4`
}

async function putVideo(objectName: string): Promise<void> {
  await ensureBucket(videoBucket)
  await minioClient.putObject(videoBucket, objectName, Buffer.alloc(16), 16, {
    'Content-Type': 'video/mp4',
  })
}

describe('attachVideo', () => {
  it('attaches a valid upload to the lesson', () =>
    withRollback(async (tx) => {
      const ownerId = await insertUser(tx)
      const { id: courseId } = await insertCourse(tx, { authorId: ownerId })
      const { id: lessonId } = await insertLesson(tx, { courseId })
      const objectName = toObjectName(ownerId, courseId)

      await putVideo(objectName)

      const lesson = await attachVideo(tx, { ownerId, courseId, lessonId, objectName, ...metadata })

      const [asset] = await tx
        .select({
          id: assets.id,
          kind: assets.kind,
          contentType: assets.contentType,
          sizeBytes: assets.sizeBytes,
          durationSec: assets.durationSec,
          width: assets.width,
          height: assets.height,
        })
        .from(assets)
        .where(eq(assets.objectName, objectName))

      expect(lesson).toMatchObject({ videoAssetId: asset.id, durationSec: 90 })
      expect(asset).toMatchObject({
        kind: 'video',
        contentType: 'video/mp4',
        sizeBytes: 16,
        durationSec: 90,
        width: 1920,
        height: 1080,
      })
    }))

  it('stores unknown metadata as missing', () =>
    withRollback(async (tx) => {
      const ownerId = await insertUser(tx)
      const { id: courseId } = await insertCourse(tx, { authorId: ownerId })
      const { id: lessonId } = await insertLesson(tx, { courseId })
      const objectName = toObjectName(ownerId, courseId)

      await putVideo(objectName)

      await attachVideo(tx, {
        ownerId,
        courseId,
        lessonId,
        objectName,
        durationSec: 0,
        width: 0,
        height: 0,
      })

      const [asset] = await tx
        .select({ durationSec: assets.durationSec, width: assets.width, height: assets.height })
        .from(assets)
        .where(eq(assets.objectName, objectName))

      expect(asset).toEqual({ durationSec: null, width: null, height: null })
    }))

  it('updates the chapter and course durations', () =>
    withRollback(async (tx) => {
      const ownerId = await insertUser(tx)
      const { id: courseId } = await insertCourse(tx, { authorId: ownerId })
      const { id: chapterId } = await insertChapter(tx, { courseId })
      const { id: lessonId } = await insertLesson(tx, { courseId, chapterId })
      const objectName = toObjectName(ownerId, courseId)

      await insertLesson(tx, { courseId, chapterId, durationSec: 30 })
      await insertLesson(tx, { courseId, durationSec: 15 })
      await putVideo(objectName)

      await attachVideo(tx, { ownerId, courseId, lessonId, objectName, ...metadata })

      const [chapter] = await tx
        .select({ durationSec: chapters.durationSec })
        .from(chapters)
        .where(eq(chapters.id, chapterId))

      const [course] = await tx
        .select({ durationSec: courses.durationSec })
        .from(courses)
        .where(eq(courses.id, courseId))

      expect(chapter.durationSec).toBe(120)
      expect(course.durationSec).toBe(135)
    }))

  it('rejects a lesson that already has a video', () =>
    withRollback(async (tx) => {
      const ownerId = await insertUser(tx)
      const { id: courseId } = await insertCourse(tx, { authorId: ownerId })
      const video = await insertAsset(tx, { ownerId })
      const { id: lessonId } = await insertLesson(tx, { courseId, videoAssetId: video.id })
      const objectName = toObjectName(ownerId, courseId)

      await putVideo(objectName)

      await expect(
        attachVideo(tx, { ownerId, courseId, lessonId, objectName, ...metadata }),
      ).rejects.toThrow('This lesson already has a video')
    }))

  it('rejects a lesson of another course', () =>
    withRollback(async (tx) => {
      const ownerId = await insertUser(tx)
      const { id: courseId } = await insertCourse(tx, { authorId: ownerId })
      const { id: otherCourseId } = await insertCourse(tx, { authorId: ownerId })
      const { id: lessonId } = await insertLesson(tx, { courseId: otherCourseId })
      const objectName = toObjectName(ownerId, courseId)

      await expect(
        attachVideo(tx, { ownerId, courseId, lessonId, objectName, ...metadata }),
      ).rejects.toThrow('The lesson no longer exists')
    }))

  it('rejects an object outside the course folder', () =>
    withRollback(async (tx) => {
      const ownerId = await insertUser(tx)
      const { id: courseId } = await insertCourse(tx, { authorId: ownerId })
      const { id: lessonId } = await insertLesson(tx, { courseId })
      const objectName = toObjectName(ownerId, courseId + 1)

      await expect(
        attachVideo(tx, { ownerId, courseId, lessonId, objectName, ...metadata }),
      ).rejects.toThrow('The uploaded video does not belong to this course')
    }))

  it('rejects a missing object', () =>
    withRollback(async (tx) => {
      const ownerId = await insertUser(tx)
      const { id: courseId } = await insertCourse(tx, { authorId: ownerId })
      const { id: lessonId } = await insertLesson(tx, { courseId })
      const objectName = toObjectName(ownerId, courseId)

      await expect(
        attachVideo(tx, { ownerId, courseId, lessonId, objectName, ...metadata }),
      ).rejects.toThrow('The uploaded video was not found')
    }))
})
