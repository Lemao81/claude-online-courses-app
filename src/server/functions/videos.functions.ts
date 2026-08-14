import { notFound, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { videoUploadUrlExpirySec } from '#/config/constants'
import { db } from '#/server/db'
import { courses } from '#/server/db/schema'
import { requireUserId } from '#/server/functions/auth.server'
import { ensureBucket, minioClient, videoBucket } from '#/server/minio'
import { toFileExtension } from '#/utils/helpers'
import type { VideoUploadTarget } from '#/utils/types'

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
