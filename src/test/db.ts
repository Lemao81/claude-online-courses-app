import { TransactionRollbackError } from 'drizzle-orm'
import { db } from '#/server/db/client'
import type { Transaction } from '#/server/db/types'

export async function withRollback(run: (tx: Transaction) => Promise<void>): Promise<void> {
  try {
    await db.transaction(async (tx) => {
      await run(tx)
      tx.rollback()
    })
  } catch (error) {
    if (!(error instanceof TransactionRollbackError)) {
      throw error
    }
  }
}
