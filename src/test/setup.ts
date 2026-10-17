import { inject } from 'vitest'

const minio = inject('minio')

process.env.DATABASE_URL = inject('databaseUrl')
process.env.MINIO_ENDPOINT = minio.endpoint
process.env.MINIO_PORT = String(minio.port)
process.env.MINIO_USE_SSL = 'false'
process.env.MINIO_ROOT_USER = minio.user
process.env.MINIO_ROOT_PASSWORD = minio.password
