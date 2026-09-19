import { and, eq, inArray, isNotNull } from 'drizzle-orm'
import { assets, courses, enrollments, lessons } from '#/server/db/schema'
import type { Database } from '#/server/db/types'

export async function removeCourse(database: Database, courseId: number): Promise<number[]> {
  return database.transaction(async (tx) => {
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
  })
}
