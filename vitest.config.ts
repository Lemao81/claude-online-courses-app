import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/**/*.test.ts'],
          exclude: [...configDefaults.exclude, 'src/**/*.db.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'db',
          include: ['src/**/*.db.test.ts'],
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
