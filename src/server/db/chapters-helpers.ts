import { and, asc, desc, eq, isNull } from 'drizzle-orm'
import { outlineChangedMessage } from '@/constants/error-messages'
import { chapters, lessons } from '@/server/db/schema'
import type { Database } from '@/server/db/types'
import { hasSameIds } from '@/server/helpers'
import type { Chapter } from '@/types'

export async function removeChapter(
  database: Database,
  chapter: Pick<Chapter, 'id' | 'courseId'>,
): Promise<void> {
  await database.transaction(async (tx) => {
    const [last] = await tx
      .select({ position: lessons.position })
      .from(lessons)
      .where(and(eq(lessons.courseId, chapter.courseId), isNull(lessons.chapterId)))
      .orderBy(desc(lessons.position))
      .limit(1)

    const moved = await tx
      .select({ id: lessons.id })
      .from(lessons)
      .where(eq(lessons.chapterId, chapter.id))
      .orderBy(asc(lessons.position), asc(lessons.id))

    const start = last ? last.position + 1 : 0

    for (const [index, lesson] of moved.entries()) {
      await tx
        .update(lessons)
        .set({ chapterId: null, position: start + index })
        .where(eq(lessons.id, lesson.id))
    }

    await tx.delete(chapters).where(eq(chapters.id, chapter.id))
  })
}

export async function setChapterOrder(
  database: Database,
  courseId: number,
  chapterIds: number[],
): Promise<void> {
  await database.transaction(async (tx) => {
    const current = await tx
      .select({ id: chapters.id })
      .from(chapters)
      .where(eq(chapters.courseId, courseId))
      .for('update')

    if (
      !hasSameIds(
        current.map((c) => c.id),
        chapterIds,
      )
    ) {
      throw new Error(outlineChangedMessage)
    }

    for (const [position, id] of chapterIds.entries()) {
      await tx.update(chapters).set({ position }).where(eq(chapters.id, id))
    }
  })
}
