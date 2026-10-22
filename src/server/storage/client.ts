import { S3Client } from '@aws-sdk/client-s3'

const accessKeyId = process.env.RUSTFS_ACCESS_KEY
const secretAccessKey = process.env.RUSTFS_SECRET_KEY

if (!accessKeyId) {
  throw new Error('RUSTFS_ACCESS_KEY is not set')
}

if (!secretAccessKey) {
  throw new Error('RUSTFS_SECRET_KEY is not set')
}

const protocol = process.env.RUSTFS_USE_SSL === 'true' ? 'https' : 'http'
const host = process.env.RUSTFS_ENDPOINT ?? 'localhost'
const port = Number(process.env.RUSTFS_PORT ?? 9000)

export const storageClient = new S3Client({
  endpoint: `${protocol}://${host}:${port}`,
  region: 'us-east-1',
  forcePathStyle: true,
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
  credentials: { accessKeyId, secretAccessKey },
})
