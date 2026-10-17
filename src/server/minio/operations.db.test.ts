import { describe, expect, it } from 'vitest'
import { minioClient } from '@/server/minio/client'
import { ensureBucket, removeObject } from '@/server/minio/operations'

function toBucketName(): string {
  return `test-${crypto.randomUUID()}`
}

describe('ensureBucket', () => {
  it('creates a missing bucket', async () => {
    const bucket = toBucketName()

    await ensureBucket(bucket)

    expect(await minioClient.bucketExists(bucket)).toBe(true)
  })

  it('accepts an existing bucket', async () => {
    const bucket = toBucketName()

    await minioClient.makeBucket(bucket)

    await expect(ensureBucket(bucket)).resolves.toBeUndefined()
  })
})

describe('removeObject', () => {
  it('removes a stored object', async () => {
    const bucket = toBucketName()

    await ensureBucket(bucket)
    await minioClient.putObject(bucket, 'file.txt', Buffer.from('content'))

    await removeObject(bucket, 'file.txt')

    await expect(minioClient.statObject(bucket, 'file.txt')).rejects.toThrow()
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
