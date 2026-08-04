import type { chapters, courses, lessons } from '#/server/db/schema'

export type Course = typeof courses.$inferSelect

export type CourseStatus = Course['status']

export type Chapter = typeof chapters.$inferSelect

export type Lesson = typeof lessons.$inferSelect

export type ChapterLessonVideo = Pick<Lesson, 'id' | 'title' | 'durationSec'>

export type ChapterWithLessons = Chapter & { lessons: ChapterLessonVideo[] }

export type CourseWithChapters = Course & { chapters: ChapterWithLessons[] }

export type ColorMode = 'light' | 'dark'

export type ColorModePreference = ColorMode | 'system'
