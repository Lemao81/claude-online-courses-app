import { MinioContainer } from '@testcontainers/minio'
import { PostgreSqlContainer } from '@testcontainers/postgresql'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import type { TestProject } from 'vitest/node'

declare module 'vitest' {
  // biome-ignore lint/style/useConsistentTypeDefinitions: module augmentation needs an interface to merge
  export interface ProvidedContext {
    databaseUrl: string
    minio: {
      endpoint: string
      port: number
      user: string
      password: string
    }
  }
}

export async function setup(project: TestProject): Promise<() => Promise<void>> {
  const [postgres, minio] = await Promise.all([
    new PostgreSqlContainer('postgres:18.4-alpine').start(),
    new MinioContainer('minio/minio:RELEASE.2025-09-07T16-13-09Z').start(),
  ])

  const databaseUrl = postgres.getConnectionUri()
  const db = drizzle(databaseUrl)

  await migrate(db, { migrationsFolder: 'drizzle' })
  await db.$client.end()

  project.provide('databaseUrl', databaseUrl)
  project.provide('minio', {
    endpoint: minio.getHost(),
    port: minio.getPort(),
    user: minio.getUsername(),
    password: minio.getPassword(),
  })

  return async () => {
    await Promise.all([postgres.stop(), minio.stop()])
  }
}
