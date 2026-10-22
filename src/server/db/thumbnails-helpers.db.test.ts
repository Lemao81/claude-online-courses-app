import { PutObjectCommand } from '@aws-sdk/client-s3'
import { eq } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { imageBucket } from '@/constants'
import { maxThumbnailSizeBytes } from '@/constants/config'
import { thumbnailSizeMessage, thumbnailTypeMessage } from '@/constants/error-messages'
import { assets } from '@/server/db/schema'
import { attachThumbnail } from '@/server/db/thumbnails-helpers'
import { storageClient } from '@/server/storage/client'
import { ensureBucket, statObject } from '@/server/storage/operations'
import { withRollback } from '@/test/db'
import { insertCourse, insertUser } from '@/test/factories'

function toObjectName(ownerId: string, courseId: number): string {
  return `${ownerId}/${courseId}/${crypto.randomUUID()}.png`
}

async function putObject(objectName: string, contentType: string, sizeBytes = 16): Promise<void> {
  await ensureBucket(imageBucket)
  await storageClient.send(
    new PutObjectCommand({
      Bucket: imageBucket,
      Key: objectName,
      Body: Buffer.alloc(sizeBytes),
      ContentType: contentType,
    }),
  )
}

async function isStored(objectName: string): Promise<boolean> {
  return statObject(imageBucket, objectName).then(
    () => true,
    () => false,
  )
}

describe('attachThumbnail', () => {
  it('stores a valid upload as the course thumbnail', () =>
    withRollback(async (tx) => {
      const ownerId = await insertUser(tx)
      const { id: courseId } = await insertCourse(tx, { authorId: ownerId })
      const objectName = toObjectName(ownerId, courseId)

      await putObject(objectName, 'image/png')

      const { course } = await attachThumbnail(tx, { ownerId, courseId, objectName })

      const [asset] = await tx
        .select({
          id: assets.id,
          kind: assets.kind,
          status: assets.status,
          contentType: assets.contentType,
          sizeBytes: assets.sizeBytes,
        })
        .from(assets)
        .where(eq(assets.objectName, objectName))

      expect(course.thumbnailAssetId).toBe(asset.id)
      expect(asset).toMatchObject({
        kind: 'image',
        status: 'ready',
        contentType: 'image/png',
        sizeBytes: 16,
      })
    }))

  it('accepts an image of exactly 5 MB', () =>
    withRollback(async (tx) => {
      const ownerId = await insertUser(tx)
      const { id: courseId } = await insertCourse(tx, { authorId: ownerId })
      const objectName = toObjectName(ownerId, courseId)

      await putObject(objectName, 'image/webp', maxThumbnailSizeBytes)

      const { course } = await attachThumbnail(tx, { ownerId, courseId, objectName })

      expect(course.thumbnailAssetId).not.toBeNull()
    }))

  it('rejects an object outside the course folder', () =>
    withRollback(async (tx) => {
      const ownerId = await insertUser(tx)
      const { id: courseId } = await insertCourse(tx, { authorId: ownerId })
      const objectName = toObjectName(ownerId, courseId + 1)

      await expect(attachThumbnail(tx, { ownerId, courseId, objectName })).rejects.toThrow(
        'The uploaded thumbnail does not belong to this course',
      )
    }))

  it('rejects a missing object', () =>
    withRollback(async (tx) => {
      const ownerId = await insertUser(tx)
      const { id: courseId } = await insertCourse(tx, { authorId: ownerId })
      const objectName = toObjectName(ownerId, courseId)

      await expect(attachThumbnail(tx, { ownerId, courseId, objectName })).rejects.toThrow(
        'The uploaded thumbnail was not found',
      )
    }))

  it('rejects and removes a file of another type', () =>
    withRollback(async (tx) => {
      const ownerId = await insertUser(tx)
      const { id: courseId } = await insertCourse(tx, { authorId: ownerId })
      const objectName = toObjectName(ownerId, courseId)

      await putObject(objectName, 'text/plain')

      await expect(attachThumbnail(tx, { ownerId, courseId, objectName })).rejects.toThrow(
        thumbnailTypeMessage,
      )

      expect(await isStored(objectName)).toBe(false)
    }))

  it('rejects and removes an image over 5 MB', () =>
    withRollback(async (tx) => {
      const ownerId = await insertUser(tx)
      const { id: courseId } = await insertCourse(tx, { authorId: ownerId })
      const objectName = toObjectName(ownerId, courseId)

      await putObject(objectName, 'image/jpeg', maxThumbnailSizeBytes + 1)

      await expect(attachThumbnail(tx, { ownerId, courseId, objectName })).rejects.toThrow(
        thumbnailSizeMessage,
      )

      expect(await isStored(objectName)).toBe(false)
    }))
})
