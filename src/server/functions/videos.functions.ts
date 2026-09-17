import { notFound, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import {
  maxVideoDimensionPx,
  maxVideoDurationSec,
  videoBucket,
  videoUploadUrlExpirySec,
} from '#/config/constants'
import { recomputeCourseDuration } from '#/server/db/aggregates.helpers'
import { db } from '#/server/db/client'
import { assets, courses, lessons } from '#/server/db/schema'
import { requireUserId } from '#/server/functions/auth.server'
import { validateInput } from '#/server/functions/validation.helpers'
import { minioClient } from '#/server/minio/client'
import { ensureBucket } from '#/server/minio/operations'
import type { Lesson, VideoUploadTarget } from '#/types'
import { toFileExtension } from '#/utils/helpers'

const createVideoUploadUrlSchema = z.object({
  courseId: z.number().int('Course id is required'),
  fileName: z.string().trim().nonempty('File name is required'),
  contentType: z
    .string()
    .trim()
    .transform((c) => (c === '' ? 'application/octet-stream' : c)),
})

type CreateVideoUploadUrlInput = z.input<typeof createVideoUploadUrlSchema>

export const createVideoUploadUrl = createServerFn({
  method: 'POST',
})
  .validator((data: CreateVideoUploadUrlInput) => validateInput(createVideoUploadUrlSchema, data))
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
  lessonId: number
  objectName: string
  durationSec: number
  width: number
  height: number
}

function clampedNumberSchema(max: number) {
  return z
    .number()
    .catch(0)
    .transform((v) => Math.min(Math.max(Math.round(v), 0), max))
}

const completeVideoUploadSchema = z.object({
  courseId: z.number().int('Course id is required'),
  lessonId: z.number().int('Lesson id is required'),
  objectName: z.string().trim().nonempty('Object name is required'),
  durationSec: clampedNumberSchema(maxVideoDurationSec),
  width: clampedNumberSchema(maxVideoDimensionPx),
  height: clampedNumberSchema(maxVideoDimensionPx),
})

export const completeVideoUpload = createServerFn({
  method: 'POST',
})
  .validator((data: CompleteVideoUploadInput) => validateInput(completeVideoUploadSchema, data))
  .handler(async ({ data }): Promise<Lesson> => {
    const userId = await requireUserId()

    const lesson = await db.query.lessons.findFirst({
      where: eq(lessons.id, data.lessonId),
      columns: { id: true, courseId: true, videoAssetId: true },
      with: {
        course: { columns: { authorId: true } },
      },
    })

    if (!lesson || lesson.courseId !== data.courseId) {
      throw notFound()
    }

    if (lesson.course.authorId !== userId) {
      throw redirect({ to: '/courses' })
    }

    if (lesson.videoAssetId !== null) {
      throw new Error('This lesson already has a video')
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

      const [updated] = await tx
        .update(lessons)
        .set({ videoAssetId: asset.id, durationSec: data.durationSec })
        .where(eq(lessons.id, lesson.id))
        .returning()

      await recomputeCourseDuration(tx, lesson.courseId)

      return updated
    })
  })
