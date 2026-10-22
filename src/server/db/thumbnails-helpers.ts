import { imageBucket } from '@/constants'
import { maxThumbnailSizeBytes } from '@/constants/config'
import { thumbnailSizeMessage, thumbnailTypeMessage } from '@/constants/error-messages'
import { replaceCourseThumbnail, type ThumbnailReplacement } from '@/server/db/courses-helpers'
import { assets } from '@/server/db/schema'
import type { Transaction } from '@/server/db/types'
import { removeObject, statObject } from '@/server/storage/operations'
import { isThumbnailContentType } from '@/utils/helpers'

type ThumbnailUpload = {
  ownerId: string
  courseId: number
  objectName: string
}

export async function attachThumbnail(
  tx: Transaction,
  upload: ThumbnailUpload,
): Promise<ThumbnailReplacement> {
  if (!upload.objectName.startsWith(`${upload.ownerId}/${upload.courseId}/`)) {
    throw new Error('The uploaded thumbnail does not belong to this course')
  }

  const stat = await statObject(imageBucket, upload.objectName).catch(() => null)

  if (!stat) {
    throw new Error('The uploaded thumbnail was not found')
  }

  const contentType = stat.contentType ?? ''

  if (!isThumbnailContentType(contentType) || stat.size > maxThumbnailSizeBytes) {
    await removeObject(imageBucket, upload.objectName)

    throw new Error(
      isThumbnailContentType(contentType) ? thumbnailSizeMessage : thumbnailTypeMessage,
    )
  }

  const [asset] = await tx
    .insert(assets)
    .values({
      ownerId: upload.ownerId,
      kind: 'image',
      status: 'ready',
      bucket: imageBucket,
      objectName: upload.objectName,
      contentType,
      sizeBytes: stat.size,
      checksum: stat.etag,
    })
    .returning({ id: assets.id })

  return replaceCourseThumbnail(tx, upload.courseId, asset.id)
}
