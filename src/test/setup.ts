import { inject } from 'vitest'

const rustfs = inject('rustfs')

process.env.DATABASE_URL = inject('databaseUrl')
process.env.RUSTFS_ENDPOINT = rustfs.endpoint
process.env.RUSTFS_PORT = String(rustfs.port)
process.env.RUSTFS_USE_SSL = 'false'
process.env.RUSTFS_ACCESS_KEY = rustfs.accessKey
process.env.RUSTFS_SECRET_KEY = rustfs.secretKey
