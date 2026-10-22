import { PostgreSqlContainer } from '@testcontainers/postgresql'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { GenericContainer, Wait } from 'testcontainers'
import type { TestProject } from 'vitest/node'

declare module 'vitest' {
  // biome-ignore lint/style/useConsistentTypeDefinitions: module augmentation needs an interface to merge
  export interface ProvidedContext {
    databaseUrl: string
    rustfs: {
      endpoint: string
      port: number
      accessKey: string
      secretKey: string
    }
  }
}

const rustfsPort = 9000
const rustfsAccessKey = 'rustfs-test'
const rustfsSecretKey = 'rustfs-test-secret'

export async function setup(project: TestProject): Promise<() => Promise<void>> {
  const [postgres, rustfs] = await Promise.all([
    new PostgreSqlContainer('postgres:18.4-alpine').start(),
    new GenericContainer('rustfs/rustfs:1.0.3')
      .withEnvironment({
        RUSTFS_ACCESS_KEY: rustfsAccessKey,
        RUSTFS_SECRET_KEY: rustfsSecretKey,
        RUSTFS_CONSOLE_ENABLE: 'false',
      })
      .withExposedPorts(rustfsPort)
      .withWaitStrategy(Wait.forHttp('/health', rustfsPort))
      .start(),
  ])

  const databaseUrl = postgres.getConnectionUri()
  const db = drizzle(databaseUrl)

  await migrate(db, { migrationsFolder: 'drizzle' })
  await db.$client.end()

  project.provide('databaseUrl', databaseUrl)
  project.provide('rustfs', {
    endpoint: rustfs.getHost(),
    port: rustfs.getMappedPort(rustfsPort),
    accessKey: rustfsAccessKey,
    secretKey: rustfsSecretKey,
  })

  return async () => {
    await Promise.all([postgres.stop(), rustfs.stop()])
  }
}
