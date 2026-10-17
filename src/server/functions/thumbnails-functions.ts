import { notFound, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { imageBucket } from '@/constants'
import { imageUploadUrlExpirySec, maxThumbnailSizeBytes } from '@/constants/config'
import { thumbnailSizeMessage, thumbnailTypeMessage } from '@/constants/error-messages'
import { db } from '@/server/db/client'
import { courses } from '@/server/db/schema'
import { attachThumbnail } from '@/server/db/thumbnails-helpers'
import { requireUserId } from '@/server/functions/auth.server'
import { validateInput } from '@/server/functions/validation-helpers'
import { enqueueAssetDeletion } from '@/server/jobs/assets-jobs'
import { minioClient } from '@/server/minio/client'
import { ensureBucket } from '@/server/minio/operations'
import type { Course, UploadTarget } from '@/types'
import { isThumbnailContentType, toFileExtension } from '@/utils/helpers'

async function requireAuthoredCourse(courseId: number, userId: string): Promise<void> {
  const course = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
    columns: { authorId: true },
  })

  if (!course) {
    throw notFound()
  }

  if (course.authorId !== userId) {
    throw redirect({ to: '/courses' })
  }
}

const createThumbnailUploadUrlSchema = z.object({
  courseId: z.number().int('Course id is required'),
  fileName: z.string().trim().nonempty('File name is required'),
  contentType: z.string().refine(isThumbnailContentType, thumbnailTypeMessage),
  sizeBytes: z.number().max(maxThumbnailSizeBytes, thumbnailSizeMessage),
})

type CreateThumbnailUploadUrlInput = z.input<typeof createThumbnailUploadUrlSchema>

export const createThumbnailUploadUrl = createServerFn({
  method: 'POST',
})
  .validator((data: CreateThumbnailUploadUrlInput) =>
    validateInput(createThumbnailUploadUrlSchema, data),
  )
  .handler(async ({ data }): Promise<UploadTarget> => {
    const userId = await requireUserId()

    await requireAuthoredCourse(data.courseId, userId)
    await ensureBucket(imageBucket)

    const extension = toFileExtension(data.fileName)
    const objectName = `${userId}/${data.courseId}/${crypto.randomUUID()}${extension}`
    const uploadUrl = await minioClient.presignedPutObject(
      imageBucket,
      objectName,
      imageUploadUrlExpirySec,
    )

    return {
      bucket: imageBucket,
      objectName,
      contentType: data.contentType,
      uploadUrl,
    }
  })

const completeThumbnailUploadSchema = z.object({
  courseId: z.number().int('Course id is required'),
  objectName: z.string().trim().nonempty('Object name is required'),
})

type CompleteThumbnailUploadInput = z.input<typeof completeThumbnailUploadSchema>

export const completeThumbnailUpload = createServerFn({
  method: 'POST',
})
  .validator((data: CompleteThumbnailUploadInput) =>
    validateInput(completeThumbnailUploadSchema, data),
  )
  .handler(async ({ data }): Promise<Course> => {
    const userId = await requireUserId()

    await requireAuthoredCourse(data.courseId, userId)

    return db.transaction(async (tx) => {
      const { course, replacedAssetId } = await attachThumbnail(tx, {
        ownerId: userId,
        courseId: data.courseId,
        objectName: data.objectName,
      })

      if (replacedAssetId !== null) {
        await enqueueAssetDeletion(tx, replacedAssetId)
      }

      return course
    })
  })
