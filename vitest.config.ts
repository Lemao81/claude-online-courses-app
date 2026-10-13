import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'server',
          include: ['src/**/*.test.ts'],
          globalSetup: ['src/test/global-setup.ts'],
          setupFiles: ['src/test/setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'ui',
          include: ['src/**/*.test.tsx'],
          environment: 'jsdom',
        },
      },
    ],
  },
})
