import type { db } from '@/server/db/client'
import type { users } from '@/server/db/schema'
import type { Course, CourseStatus } from '@/types'

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

export type Database = typeof db | Transaction

export type ThumbnailReplacement = {
  course: Course
  replacedAssetId: number | null
}

export type UserValues = typeof users.$inferInsert

export type LessonSeed = {
  title: string
  durationSec: number
  isFreePreview?: boolean
}

export type ChapterSeed = {
  title: string
  description: string
  lessons: LessonSeed[]
}

export type CourseSeed = {
  title: string
  subtitle: string
  description: string
  status: CourseStatus
  price: string
  rating: string | null
  ratingCount: number
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
  thumbnailFile: string
  lessons: LessonSeed[]
  chapters: ChapterSeed[]
}
