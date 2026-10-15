import { notFound, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { imageBucket, thumbnailContentTypes } from '@/constants'
import { imageUploadUrlExpirySec, maxThumbnailSizeBytes } from '@/constants/config'
import { db } from '@/server/db/client'
import { replaceCourseThumbnail } from '@/server/db/courses-helpers'
import { assets, courses } from '@/server/db/schema'
import { requireUserId } from '@/server/functions/auth.server'
import { validateInput } from '@/server/functions/validation-helpers'
import { enqueueAssetDeletion } from '@/server/jobs/assets-jobs'
import { minioClient } from '@/server/minio/client'
import { ensureBucket, removeObject } from '@/server/minio/operations'
import type { Course, UploadTarget } from '@/types'
import { toFileExtension } from '@/utils/helpers'

const thumbnailTypeMessage = 'A thumbnail must be a JPEG, PNG or WebP image'

const thumbnailSizeMessage = 'A thumbnail must be 5 MB or smaller'

function isThumbnailContentType(contentType: string): boolean {
  return thumbnailContentTypes.some((t) => t === contentType)
}

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
  contentType: z.enum(thumbnailContentTypes, thumbnailTypeMessage),
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

    if (!data.objectName.startsWith(`${userId}/${data.courseId}/`)) {
      throw new Error('The uploaded thumbnail does not belong to this course')
    }

    const stat = await minioClient.statObject(imageBucket, data.objectName).catch(() => null)

    if (!stat) {
      throw new Error('The uploaded thumbnail was not found')
    }

    const contentType = stat.metaData['content-type'] ?? ''

    if (!isThumbnailContentType(contentType) || stat.size > maxThumbnailSizeBytes) {
      await removeObject(imageBucket, data.objectName)

      throw new Error(
        isThumbnailContentType(contentType) ? thumbnailSizeMessage : thumbnailTypeMessage,
      )
    }

    return db.transaction(async (tx) => {
      const [asset] = await tx
        .insert(assets)
        .values({
          ownerId: userId,
          kind: 'image',
          status: 'ready',
          bucket: imageBucket,
          objectName: data.objectName,
          contentType,
          sizeBytes: stat.size,
          checksum: stat.etag,
        })
        .returning({ id: assets.id })

      const { course, replacedAssetId } = await replaceCourseThumbnail(tx, data.courseId, asset.id)

      if (replacedAssetId !== null) {
        await enqueueAssetDeletion(tx, replacedAssetId)
      }

      return course
    })
  })
