import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3ServiceException,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { storageClient } from '@/server/storage/client'

export type ObjectStat = {
  size: number
  etag: string
  contentType: string | undefined
}

const ensuredBuckets = new Map<string, Promise<void>>()

function hasErrorName(error: unknown, names: string[]): boolean {
  return error instanceof S3ServiceException && names.includes(error.name)
}

function isBucketAlreadyOwned(error: unknown): boolean {
  return hasErrorName(error, ['BucketAlreadyOwnedByYou', 'BucketAlreadyExists'])
}

function isMissing(error: unknown): boolean {
  return hasErrorName(error, ['NoSuchKey', 'NoSuchBucket', 'NotFound'])
}

export async function bucketExists(bucket: string): Promise<boolean> {
  try {
    await storageClient.send(new HeadBucketCommand({ Bucket: bucket }))

    return true
  } catch (error) {
    if (isMissing(error)) {
      return false
    }

    throw error
  }
}

async function createBucket(bucket: string): Promise<void> {
  if (await bucketExists(bucket)) {
    return
  }

  try {
    await storageClient.send(new CreateBucketCommand({ Bucket: bucket }))
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

export async function statObject(bucket: string, objectName: string): Promise<ObjectStat> {
  const head = await storageClient.send(new HeadObjectCommand({ Bucket: bucket, Key: objectName }))

  return {
    size: head.ContentLength ?? 0,
    etag: head.ETag?.replaceAll('"', '') ?? '',
    contentType: head.ContentType,
  }
}

export async function removeObject(bucket: string, objectName: string): Promise<void> {
  try {
    await storageClient.send(new DeleteObjectCommand({ Bucket: bucket, Key: objectName }))
  } catch (error) {
    if (!isMissing(error)) {
      throw error
    }
  }
}

export function createDownloadUrl(
  bucket: string,
  objectName: string,
  expiresInSec: number,
): Promise<string> {
  return getSignedUrl(storageClient, new GetObjectCommand({ Bucket: bucket, Key: objectName }), {
    expiresIn: expiresInSec,
  })
}

export function createUploadUrl(
  bucket: string,
  objectName: string,
  expiresInSec: number,
): Promise<string> {
  return getSignedUrl(storageClient, new PutObjectCommand({ Bucket: bucket, Key: objectName }), {
    expiresIn: expiresInSec,
  })
}
