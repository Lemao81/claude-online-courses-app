import { Client, S3Error } from 'minio'

const accessKey = process.env.MINIO_ROOT_USER
const secretKey = process.env.MINIO_ROOT_PASSWORD

if (!accessKey) {
  throw new Error('MINIO_ROOT_USER is not set')
}

if (!secretKey) {
  throw new Error('MINIO_ROOT_PASSWORD is not set')
}

export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT ?? 'localhost',
  port: Number(process.env.MINIO_PORT ?? 9000),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey,
  secretKey,
})

export const videoBucket = 'videos'

const ensuredBuckets = new Map<string, Promise<void>>()

function isBucketAlreadyOwned(error: unknown): boolean {
  return (
    error instanceof S3Error &&
    (error.code === 'BucketAlreadyOwnedByYou' || error.code === 'BucketAlreadyExists')
  )
}

async function createBucket(bucket: string): Promise<void> {
  if (await minioClient.bucketExists(bucket)) {
    return
  }

  try {
    await minioClient.makeBucket(bucket)
  } catch (error) {
    if (!isBucketAlreadyOwned(error)) {
      throw error
    }
  }
}

export function ensureBucket(bucket: string): Promise<void> {
  const ensured = ensuredBuckets.get(bucket)

  if (ensured) {
    return ensured
  }

  const pending = createBucket(bucket).catch((error) => {
    ensuredBuckets.delete(bucket)

    throw error
  })

  ensuredBuckets.set(bucket, pending)

  return pending
}

function isMissingObject(error: unknown): boolean {
  return (
    error instanceof S3Error &&
    (error.code === 'NoSuchKey' || error.code === 'NoSuchBucket' || error.code === 'NotFound')
  )
}

export async function removeObject(bucket: string, objectName: string): Promise<void> {
  try {
    await minioClient.removeObject(bucket, objectName)
  } catch (error) {
    if (!isMissingObject(error)) {
      throw error
    }
  }
}
