import { drizzle } from 'drizzle-orm/node-postgres'

import * as relations from '#/server/db/relations.ts'
import * as schema from '#/server/db/schema.ts'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set')
}

export const db = drizzle(databaseUrl, {
  schema: { ...schema, ...relations },
  casing: 'snake_case',
})

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0]
