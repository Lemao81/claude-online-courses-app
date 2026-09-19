import type { db } from '#/server/db/client'

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

export type Database = typeof db | Transaction
