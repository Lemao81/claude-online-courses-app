import { Client } from 'minio'

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
