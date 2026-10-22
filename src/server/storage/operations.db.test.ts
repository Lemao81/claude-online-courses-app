import { CreateBucketCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { describe, expect, it } from 'vitest'
import { storageClient } from '@/server/storage/client'
import { bucketExists, ensureBucket, removeObject, statObject } from '@/server/storage/operations'

function toBucketName(): string {
  return `test-${crypto.randomUUID()}`
}

describe('ensureBucket', () => {
  it('creates a missing bucket', async () => {
    const bucket = toBucketName()

    await ensureBucket(bucket)

    expect(await bucketExists(bucket)).toBe(true)
  })

  it('accepts an existing bucket', async () => {
    const bucket = toBucketName()

    await storageClient.send(new CreateBucketCommand({ Bucket: bucket }))

    await expect(ensureBucket(bucket)).resolves.toBeUndefined()
  })
})

describe('removeObject', () => {
  it('removes a stored object', async () => {
    const bucket = toBucketName()

    await ensureBucket(bucket)
    await storageClient.send(
      new PutObjectCommand({ Bucket: bucket, Key: 'file.txt', Body: Buffer.from('content') }),
    )

    await removeObject(bucket, 'file.txt')

    await expect(statObject(bucket, 'file.txt')).rejects.toThrow()
  })

  it('ignores a missing object', async () => {
    const bucket = toBucketName()

    await ensureBucket(bucket)

    await expect(removeObject(bucket, 'missing.txt')).resolves.toBeUndefined()
  })

  it('ignores a missing bucket', async () => {
    await expect(removeObject(toBucketName(), 'missing.txt')).resolves.toBeUndefined()
  })
})
