import { eq, sql } from 'drizzle-orm'
import type { db } from '#/db/index'
import { chapters, courses, lessons, reviews } from '#/db/schema'

type Database = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0]

export async function recomputeCourseRating(tx: Database, courseId: number): Promise<void> {
  await tx
    .update(courses)
    .set({
      rating: sql`(SELECT ROUND(AVG(${reviews.rating}), 2) FROM ${reviews} WHERE ${reviews.courseId} = ${courseId})`,
      ratingCount: sql`(SELECT COUNT(*) FROM ${reviews} WHERE ${reviews.courseId} = ${courseId})`,
    })
    .where(eq(courses.id, courseId))
}

export async function recomputeCourseDuration(tx: Database, courseId: number): Promise<void> {
  await tx
    .update(chapters)
    .set({
      durationSec: sql`COALESCE((SELECT SUM(${lessons.durationSec}) FROM ${lessons} WHERE ${lessons.chapterId} = ${chapters.id}), 0)`,
    })
    .where(eq(chapters.courseId, courseId))

  await tx
    .update(courses)
    .set({
      durationSec: sql`COALESCE((SELECT SUM(${lessons.durationSec}) FROM ${lessons} WHERE ${lessons.courseId} = ${courseId}), 0)`,
    })
    .where(eq(courses.id, courseId))
}
