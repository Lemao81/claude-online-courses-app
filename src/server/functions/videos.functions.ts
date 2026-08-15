import { notFound, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { desc, eq } from 'drizzle-orm'
import {
  maxVideoDimensionPx,
  maxVideoDurationSec,
  videoUploadUrlExpirySec,
} from '#/config/constants'
import { db } from '#/server/db'
import { recomputeCourseDuration } from '#/server/db/aggregates.helpers'
import { assets, chapters, courses, lessons } from '#/server/db/schema'
import { requireUserId } from '#/server/functions/auth.server'
import { ensureBucket, minioClient, videoBucket } from '#/server/minio'
import { toFileExtension } from '#/utils/helpers'
import type { Lesson, VideoUploadTarget } from '#/utils/types'

type CreateVideoUploadUrlInput = {
  courseId: number
  fileName: string
  contentType: string
}

function validateCreateVideoUploadUrlInput(
  data: CreateVideoUploadUrlInput,
): CreateVideoUploadUrlInput {
  if (!Number.isInteger(data.courseId)) {
    throw new Error('Course id is required')
  }

  const fileName = data.fileName.trim()

  if (fileName.length === 0) {
    throw new Error('File name is required')
  }

  const contentType = data.contentType.trim()

  return {
    courseId: data.courseId,
    fileName,
    contentType: contentType === '' ? 'application/octet-stream' : contentType,
  }
}

export const createVideoUploadUrl = createServerFn({
  method: 'POST',
})
  .validator(validateCreateVideoUploadUrlInput)
  .handler(async ({ data }): Promise<VideoUploadTarget> => {
    const userId = await requireUserId()

    const course = await db.query.courses.findFirst({
      where: eq(courses.id, data.courseId),
      columns: { authorId: true },
    })

    if (!course) {
      throw notFound()
    }

    if (course.authorId !== userId) {
      throw redirect({ to: '/courses' })
    }

    await ensureBucket(videoBucket)

    const extension = toFileExtension(data.fileName)
    const objectName = `${userId}/${data.courseId}/${crypto.randomUUID()}${extension}`
    const uploadUrl = await minioClient.presignedPutObject(
      videoBucket,
      objectName,
      videoUploadUrlExpirySec,
    )

    return {
      bucket: videoBucket,
      objectName,
      contentType: data.contentType,
      uploadUrl,
    }
  })

type CompleteVideoUploadInput = {
  courseId: number
  chapterId: number
  objectName: string
  title: string
  durationSec: number
  width: number
  height: number
}

function toDimension(value: number): number {
  if (!Number.isFinite(value)) {
    return 0
  }

  return Math.min(Math.max(Math.round(value), 0), maxVideoDimensionPx)
}

function validateCompleteVideoUploadInput(
  data: CompleteVideoUploadInput,
): CompleteVideoUploadInput {
  if (!Number.isInteger(data.courseId)) {
    throw new Error('Course id is required')
  }

  if (!Number.isInteger(data.chapterId)) {
    throw new Error('Chapter id is required')
  }

  const objectName = data.objectName.trim()

  if (objectName.length === 0) {
    throw new Error('Object name is required')
  }

  const title = data.title.trim()

  if (title.length === 0) {
    throw new Error('Title is required')
  }

  const durationSec = Number.isFinite(data.durationSec) ? Math.round(data.durationSec) : 0

  return {
    courseId: data.courseId,
    chapterId: data.chapterId,
    objectName,
    title,
    durationSec: Math.min(Math.max(durationSec, 0), maxVideoDurationSec),
    width: toDimension(data.width),
    height: toDimension(data.height),
  }
}

export const completeVideoUpload = createServerFn({
  method: 'POST',
})
  .validator(validateCompleteVideoUploadInput)
  .handler(async ({ data }): Promise<Lesson> => {
    const userId = await requireUserId()

    const chapter = await db.query.chapters.findFirst({
      where: eq(chapters.id, data.chapterId),
      columns: { id: true, courseId: true },
      with: {
        course: { columns: { authorId: true } },
      },
    })

    if (!chapter || chapter.courseId !== data.courseId) {
      throw notFound()
    }

    if (chapter.course.authorId !== userId) {
      throw redirect({ to: '/courses' })
    }

    if (!data.objectName.startsWith(`${userId}/${data.courseId}/`)) {
      throw new Error('The uploaded video does not belong to this course')
    }

    const stat = await minioClient.statObject(videoBucket, data.objectName).catch(() => null)

    if (!stat) {
      throw new Error('The uploaded video was not found')
    }

    return db.transaction(async (tx) => {
      const [asset] = await tx
        .insert(assets)
        .values({
          ownerId: userId,
          kind: 'video',
          status: 'ready',
          bucket: videoBucket,
          objectName: data.objectName,
          contentType: stat.metaData['content-type'] ?? 'application/octet-stream',
          sizeBytes: stat.size,
          checksum: stat.etag,
          durationSec: data.durationSec === 0 ? null : data.durationSec,
          width: data.width === 0 ? null : data.width,
          height: data.height === 0 ? null : data.height,
        })
        .returning()

      const [last] = await tx
        .select({ position: lessons.position })
        .from(lessons)
        .where(eq(lessons.chapterId, chapter.id))
        .orderBy(desc(lessons.position))
        .limit(1)

      const [lesson] = await tx
        .insert(lessons)
        .values({
          courseId: chapter.courseId,
          chapterId: chapter.id,
          position: last ? last.position + 1 : 0,
          title: data.title,
          videoAssetId: asset.id,
          durationSec: data.durationSec,
        })
        .returning()

      await recomputeCourseDuration(tx, chapter.courseId)

      return lesson
    })
  })
