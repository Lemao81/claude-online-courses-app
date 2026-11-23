import { setupClerkTestingToken } from '@clerk/testing/playwright'
import { test as base, type Page } from '@playwright/test'
import { is, sql } from 'drizzle-orm'
import { PgTable } from 'drizzle-orm/pg-core'
import type { db } from '@/server/db/client'
import * as schema from '@/server/db/schema'

const applicationTables = Object.values(schema).filter((value) => is(value, PgTable))

async function waitForHydration(page: Page): Promise<void> {
  await page.waitForFunction(() =>
    Object.keys(document).some((k) => k.startsWith('__reactContainer')),
  )

  await page.waitForLoadState('networkidle')
}

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

    const goto = page.goto.bind(page)
    const reload = page.reload.bind(page)

    page.goto = async (...args) => {
      const response = await goto(...args)
      await waitForHydration(page)

      return response
    }

    page.reload = async (...args) => {
      const response = await reload(...args)
      await waitForHydration(page)

      return response
    }

    await use(page)
  },
})

export { expect } from '@playwright/test'
