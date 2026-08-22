import {
  assetDeleteBatchSize,
  assetDeleteRetryDelaySec,
  assetDeleteRetryLimit,
  assetSweepCron,
  workerStopTimeoutMs,
} from '#/config/constants'
import { handleAssetDeletion, sweepDeletedAssets } from '#/server/jobs/assets.jobs'
import { createWorkerBoss } from '#/server/jobs/client'
import { assetDeadLetterQueue, assetDeleteQueue, assetSweepQueue } from '#/server/jobs/queues'

const boss = createWorkerBoss()

await boss.start()

await boss.createQueue(assetDeadLetterQueue)

await boss.createQueue(assetDeleteQueue, {
  policy: 'short',
  retryLimit: assetDeleteRetryLimit,
  retryDelay: assetDeleteRetryDelaySec,
  retryBackoff: true,
  deadLetter: assetDeadLetterQueue,
})

await boss.createQueue(assetSweepQueue, { policy: 'exclusive' })

await boss.work(assetDeleteQueue, { batchSize: assetDeleteBatchSize }, handleAssetDeletion)

await boss.work(assetSweepQueue, () => sweepDeletedAssets(boss))

await boss.schedule(assetSweepQueue, assetSweepCron)

console.log(`[worker] ready, sweeping deleted assets on "${assetSweepCron}"`)

async function shutdown(signal: NodeJS.Signals): Promise<void> {
  console.log(`[worker] received ${signal}, stopping`)
  await boss.stop({ graceful: true, timeout: workerStopTimeoutMs })
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
