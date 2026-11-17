import { PostgreSqlContainer } from '@testcontainers/postgresql'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { GenericContainer, Wait } from 'testcontainers'

const rustfsPort = 9000
const rustfsAccessKey = 'rustfs-test'
const rustfsSecretKey = 'rustfs-test-secret'

export async function startTestContainers(corsOrigin?: string): Promise<{
  env: Record<string, string>
  stop: () => Promise<void>
}> {
  const [postgres, rustfs] = await Promise.all([
    new PostgreSqlContainer('postgres:18.4-alpine').start(),
    new GenericContainer('rustfs/rustfs:1.0.3')
      .withEnvironment({
        RUSTFS_ACCESS_KEY: rustfsAccessKey,
        RUSTFS_SECRET_KEY: rustfsSecretKey,
        RUSTFS_CONSOLE_ENABLE: 'false',
        ...(corsOrigin ? { RUSTFS_CORS_ALLOWED_ORIGINS: corsOrigin } : {}),
      })
      .withExposedPorts(rustfsPort)
      .withWaitStrategy(Wait.forHttp('/health', rustfsPort))
      .start(),
  ])

  async function stop(): Promise<void> {
    await Promise.all([postgres.stop(), rustfs.stop()])
  }

  const databaseUrl = postgres.getConnectionUri()
  const db = drizzle(databaseUrl)

  try {
    await migrate(db, { migrationsFolder: 'drizzle' })
  } catch (error) {
    await stop()
    throw error
  } finally {
    await db.$client.end()
  }

  return {
    env: {
      DATABASE_URL: databaseUrl,
      RUSTFS_ENDPOINT: rustfs.getHost(),
      RUSTFS_PORT: String(rustfs.getMappedPort(rustfsPort)),
      RUSTFS_USE_SSL: 'false',
      RUSTFS_ACCESS_KEY: rustfsAccessKey,
      RUSTFS_SECRET_KEY: rustfsSecretKey,
    },
    stop,
  }
}
