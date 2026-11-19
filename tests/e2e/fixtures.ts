import { setupClerkTestingToken } from '@clerk/testing/playwright'
import { test as base } from '@playwright/test'
import { is, sql } from 'drizzle-orm'
import { PgTable } from 'drizzle-orm/pg-core'
import type { db } from '@/server/db/client'
import * as schema from '@/server/db/schema'

const applicationTables = Object.values(schema).filter((value) => is(value, PgTable))

export const test = base.extend<{ emptyDatabase: void }, { database: typeof db }>({
  database: [
    async ({}, use) => {
      const client = await import('@/server/db/client')

      await use(client.db)
      await client.db.$client.end()
    },
    { scope: 'worker' },
  ],
  emptyDatabase: [
    async ({ database }, use) => {
      await database.execute(
        sql`truncate ${sql.join(applicationTables, sql`, `)} restart identity cascade`,
      )

      await use()
    },
    { auto: true },
  ],
  page: async ({ page }, use) => {
    await setupClerkTestingToken({ page })
    await use(page)
  },
})

export { expect } from '@playwright/test'
