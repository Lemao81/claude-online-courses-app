import type { courses } from '#/server/db/schema'

export type Course = typeof courses.$inferSelect

export type CourseStatus = Course['status']

export type ColorMode = 'light' | 'dark'

export type ColorModePreference = ColorMode | 'system'
