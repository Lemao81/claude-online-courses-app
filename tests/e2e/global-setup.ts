import { type ChildProcess, spawn } from 'node:child_process'
import { once } from 'node:events'
import { setTimeout } from 'node:timers/promises'
import { imageBucket, videoBucket } from '@/constants'
import { startTestContainers } from '@/test/containers'
import {
  devServerPollIntervalMs,
  devServerStartTimeoutMs,
  e2eBaseUrl,
  e2ePort,
} from './e2e-constants'

async function stopDevServer(devServer: ChildProcess): Promise<void> {
  if (devServer.exitCode !== null || devServer.signalCode !== null) {
    return
  }

  const exited = once(devServer, 'exit')
  devServer.kill()
  await exited
}

async function waitForDevServer(devServer: ChildProcess): Promise<void> {
  const deadline = Date.now() + devServerStartTimeoutMs

  while (Date.now() < deadline) {
    if (devServer.exitCode !== null) {
      throw new Error(`The e2e dev server exited with code ${devServer.exitCode}`)
    }

    const response = await fetch(e2eBaseUrl).catch(() => null)

    if (response?.ok) {
      return
    }

    await setTimeout(devServerPollIntervalMs)
  }

  throw new Error(`The e2e dev server did not respond at ${e2eBaseUrl}`)
}

async function startDevServer(): Promise<ChildProcess> {
  if (await fetch(e2eBaseUrl).catch(() => null)) {
    throw new Error(`Port ${e2ePort} is already in use; stop whatever serves ${e2eBaseUrl}`)
  }

  const devServer = spawn(
    process.execPath,
    ['node_modules/vite/bin/vite.js', 'dev', '--port', String(e2ePort), '--strictPort'],
    { env: process.env, stdio: ['ignore', 'ignore', 'inherit'] },
  )

  try {
    await waitForDevServer(devServer)
  } catch (error) {
    await stopDevServer(devServer)
    throw error
  }

  return devServer
}

export default async function globalSetup(): Promise<() => Promise<void>> {
  const containers = await startTestContainers(e2eBaseUrl)

  Object.assign(process.env, containers.env)

  try {
    const { ensureBucket } = await import('@/server/storage/operations')

    await Promise.all([ensureBucket(imageBucket), ensureBucket(videoBucket)])

    const devServer = await startDevServer()

    return async () => {
      await stopDevServer(devServer)
      await containers.stop()
    }
  } catch (error) {
    await containers.stop()
    throw error
  }
}
