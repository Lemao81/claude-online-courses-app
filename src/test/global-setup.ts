import type { TestProject } from 'vitest/node'
import { startTestContainers } from '@/test/containers'

declare module 'vitest' {
  // biome-ignore lint/style/useConsistentTypeDefinitions: module augmentation needs an interface to merge
  export interface ProvidedContext {
    testEnv: Record<string, string>
  }
}

export async function setup(project: TestProject): Promise<() => Promise<void>> {
  const containers = await startTestContainers()

  project.provide('testEnv', containers.env)

  return containers.stop
}
