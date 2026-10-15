import type {
  FormAsyncValidateOrFn,
  FormValidateOrFn,
  ReactFormExtendedApi,
} from '@tanstack/react-form'
import type { assets, chapters, courses, enrollments, lessons } from '@/server/db/schema'

export type Course = typeof courses.$inferSelect

export type CourseStatus = Course['status']

export type Chapter = typeof chapters.$inferSelect

export type Lesson = typeof lessons.$inferSelect

export type Asset = typeof assets.$inferSelect

export type Enrollment = typeof enrollments.$inferSelect

export type LessonVideo = Pick<Lesson, 'id' | 'title' | 'durationSec'>

export type ChapterWithLessons = Chapter & { lessons: LessonVideo[] }

export type CourseOutline = Course & { lessons: LessonVideo[]; chapters: ChapterWithLessons[] }

export type LessonOrder = { chapterId: number | null; lessonIds: number[] }

export type VideoMetadata = {
  durationSec: number
  width: number
  height: number
}

export type UploadTarget = {
  bucket: string
  objectName: string
  contentType: string
  uploadUrl: string
}

export type AssetDeletePayload = {
  assetId: number
}

export type ColorMode = 'light' | 'dark'

export type ColorModePreference = ColorMode | 'system'

type Sync<T> = FormValidateOrFn<T> | undefined

type Async<T> = FormAsyncValidateOrFn<T> | undefined

export type FormApi<T> = ReactFormExtendedApi<
  T,
  Sync<T>,
  Sync<T>,
  Async<T>,
  Sync<T>,
  Async<T>,
  Sync<T>,
  Async<T>,
  Sync<T>,
  Async<T>,
  Async<T>,
  unknown
>
