import { PgBoss } from 'pg-boss'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set')
}

const connectionString = databaseUrl

let senderPromise: Promise<PgBoss> | null = null

export function createWorkerBoss(): PgBoss {
  const boss = new PgBoss({ connectionString, application_name: 'coca-worker' })

  boss.on('error', (error) => console.error('[jobs] worker error', error))

  return boss
}

export function getSenderBoss(): Promise<PgBoss> {
  if (senderPromise) {
    return senderPromise
  }

  const boss = new PgBoss({
    connectionString,
    application_name: 'coca-sender',
    migrate: false,
    supervise: false,
    schedule: false,
    max: 2,
  })

  boss.on('error', (error) => console.error('[jobs] sender error', error))

  senderPromise = boss.start().catch((error) => {
    senderPromise = null

    throw error
  })

  return senderPromise
}
