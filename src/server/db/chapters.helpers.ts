import { and, asc, desc, eq, isNull } from 'drizzle-orm'
import { chapters, lessons } from '#/server/db/schema'
import type { Database } from '#/server/db/types'
import type { Chapter } from '#/types'

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
