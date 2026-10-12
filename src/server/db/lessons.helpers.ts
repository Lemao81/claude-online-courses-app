import { and, eq, inArray, isNull, or } from 'drizzle-orm'
import { outlineChangedMessage } from '@/constants/error.messages'
import { recomputeCourseDuration } from '@/server/db/aggregates.helpers'
import { chapters, lessons } from '@/server/db/schema'
import type { Database } from '@/server/db/types'
import { hasSameIds } from '@/server/helpers'
import type { LessonOrder } from '@/types'

function requireDistinctParents(parentIds: (number | null)[]): void {
  if (new Set(parentIds).size !== parentIds.length) {
    throw new Error(outlineChangedMessage)
  }
}

async function requireChaptersInCourse(
  tx: Database,
  courseId: number,
  chapterIds: number[],
): Promise<void> {
  if (chapterIds.length === 0) {
    return
  }

  const owned = await tx
    .select({ id: chapters.id })
    .from(chapters)
    .where(and(eq(chapters.courseId, courseId), inArray(chapters.id, chapterIds)))

  if (owned.length !== chapterIds.length) {
    throw new Error(outlineChangedMessage)
  }
}

async function requireLessonsUnchanged(
  tx: Database,
  courseId: number,
  parentIds: (number | null)[],
  chapterIds: number[],
  sentIds: number[],
): Promise<void> {
  const current = await tx
    .select({ id: lessons.id })
    .from(lessons)
    .where(
      and(
        eq(lessons.courseId, courseId),
        or(
          parentIds.includes(null) ? isNull(lessons.chapterId) : undefined,
          chapterIds.length > 0 ? inArray(lessons.chapterId, chapterIds) : undefined,
        ),
      ),
    )
    .for('update')

  if (
    !hasSameIds(
      current.map((l) => l.id),
      sentIds,
    )
  ) {
    throw new Error(outlineChangedMessage)
  }
}

async function writeLessonOrders(tx: Database, orders: LessonOrder[]): Promise<void> {
  for (const { chapterId, lessonIds } of orders) {
    for (const [position, id] of lessonIds.entries()) {
      await tx.update(lessons).set({ chapterId, position }).where(eq(lessons.id, id))
    }
  }
}

export async function setLessonOrder(
  database: Database,
  courseId: number,
  orders: LessonOrder[],
): Promise<void> {
  await database.transaction(async (tx) => {
    const parentIds = orders.map((o) => o.chapterId)
    const chapterIds = parentIds.filter((id) => id !== null)
    const sentIds = orders.flatMap((o) => o.lessonIds)

    requireDistinctParents(parentIds)
    await requireChaptersInCourse(tx, courseId, chapterIds)
    await requireLessonsUnchanged(tx, courseId, parentIds, chapterIds, sentIds)

    await writeLessonOrders(tx, orders)
    await recomputeCourseDuration(tx, courseId)
  })
}
