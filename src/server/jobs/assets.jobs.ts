import { and, eq, isNotNull, sql } from 'drizzle-orm'
import type { Job, PgBoss } from 'pg-boss'
import { fromDrizzle } from 'pg-boss'
import { assetSweepBatchSize } from '#/config/constants'
import { db } from '#/server/db/client'
import { assets } from '#/server/db/schema'
import type { Transaction } from '#/server/db/types'
import { getSenderBoss } from '#/server/jobs/client'
import { assetDeleteQueue } from '#/server/jobs/queues'
import { removeObject } from '#/server/minio/operations'
import type { AssetDeletePayload } from '#/utils/types'

export async function enqueueAssetDeletion(tx: Transaction, assetId: number): Promise<void> {
  try {
    const boss = await getSenderBoss()

    await tx.transaction(async (inner) => {
      await boss.send(assetDeleteQueue, { assetId } satisfies AssetDeletePayload, {
        singletonKey: String(assetId),
        db: fromDrizzle(inner, sql),
      })
    })
  } catch (error) {
    console.error(
      `[jobs] could not enqueue deletion of asset ${assetId}, leaving it to the sweep`,
      error,
    )
  }
}

async function deleteAsset(assetId: number): Promise<void> {
  await db.transaction(async (tx) => {
    const [deleted] = await tx
      .delete(assets)
      .where(and(eq(assets.id, assetId), isNotNull(assets.deletedAt)))
      .returning({ bucket: assets.bucket, objectName: assets.objectName })

    if (!deleted) {
      return
    }

    await removeObject(deleted.bucket, deleted.objectName)
  })
}

export async function handleAssetDeletion(jobs: Job<AssetDeletePayload>[]): Promise<void> {
  for (const job of jobs) {
    await deleteAsset(job.data.assetId)
  }
}

export async function sweepDeletedAssets(boss: PgBoss): Promise<number> {
  const stale = await db
    .select({ id: assets.id })
    .from(assets)
    .where(isNotNull(assets.deletedAt))
    .limit(assetSweepBatchSize)

  for (const asset of stale) {
    await boss.send(assetDeleteQueue, { assetId: asset.id } satisfies AssetDeletePayload, {
      singletonKey: String(asset.id),
    })
  }

  return stale.length
}
