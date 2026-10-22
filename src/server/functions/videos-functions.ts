import { notFound, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { videoBucket } from '@/constants'
import {
  maxVideoDimensionPx,
  maxVideoDurationSec,
  videoUploadUrlExpirySec,
} from '@/constants/config'
import { db } from '@/server/db/client'
import { courses, lessons } from '@/server/db/schema'
import { attachVideo } from '@/server/db/videos-helpers'
import { requireUserId } from '@/server/functions/auth.server'
import { validateInput } from '@/server/functions/validation-helpers'
import { createUploadUrl, ensureBucket } from '@/server/storage/operations'
import type { Lesson, UploadTarget } from '@/types'
import { toFileExtension } from '@/utils/helpers'

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
  .handler(async ({ data }): Promise<UploadTarget> => {
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
    const uploadUrl = await createUploadUrl(videoBucket, objectName, videoUploadUrlExpirySec)

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

function clampedNumberSchema(
  max: number,
): z.ZodPipe<z.ZodCatch<z.ZodNumber>, z.ZodTransform<number, number>> {
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
      columns: { courseId: true },
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

    return db.transaction((tx) => attachVideo(tx, { ...data, ownerId: userId }))
  })
