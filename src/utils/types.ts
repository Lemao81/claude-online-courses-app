import type { courses } from '#/server/db/schema'

export type Course = typeof courses.$inferSelect
