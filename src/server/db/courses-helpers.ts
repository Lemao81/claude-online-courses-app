import { and, eq, inArray, isNotNull } from 'drizzle-orm'
import { assets, courses, enrollments, lessons } from '@/server/db/schema'
import type { Transaction } from '@/server/db/types'
import type { Course } from '@/types'

export type ThumbnailReplacement = {
  course: Course
  replacedAssetId: number | null
}

export async function removeCourse(tx: Transaction, courseId: number): Promise<number[]> {
  const [course] = await tx
    .select({ status: courses.status, thumbnailAssetId: courses.thumbnailAssetId })
    .from(courses)
    .where(eq(courses.id, courseId))
    .for('update')

  if (!course) {
    throw new Error('The course no longer exists')
  }

  if (course.status !== 'draft') {
    throw new Error('Only a draft course can be deleted')
  }

  const [enrollment] = await tx
    .select({ id: enrollments.id })
    .from(enrollments)
    .where(eq(enrollments.courseId, courseId))
    .limit(1)

  if (enrollment) {
    throw new Error('A course with enrollments cannot be deleted')
  }

  const videos = await tx
    .select({ assetId: lessons.videoAssetId })
    .from(lessons)
    .where(and(eq(lessons.courseId, courseId), isNotNull(lessons.videoAssetId)))

  const assetIds = [course.thumbnailAssetId, ...videos.map((v) => v.assetId)].filter(
    (id): id is number => id !== null,
  )

  await tx.delete(courses).where(eq(courses.id, courseId))

  if (assetIds.length > 0) {
    await tx.update(assets).set({ deletedAt: new Date() }).where(inArray(assets.id, assetIds))
  }

  return assetIds
}

export async function replaceCourseThumbnail(
  tx: Transaction,
  courseId: number,
  assetId: number,
): Promise<ThumbnailReplacement> {
  const [course] = await tx
    .select({ thumbnailAssetId: courses.thumbnailAssetId })
    .from(courses)
    .where(eq(courses.id, courseId))
    .for('update')

  if (!course) {
    throw new Error('The course no longer exists')
  }

  const [updated] = await tx
    .update(courses)
    .set({ thumbnailAssetId: assetId })
    .where(eq(courses.id, courseId))
    .returning()

  const replacedAssetId = course.thumbnailAssetId

  if (replacedAssetId !== null) {
    await tx.update(assets).set({ deletedAt: new Date() }).where(eq(assets.id, replacedAssetId))
  }

  return { course: updated, replacedAssetId }
}
