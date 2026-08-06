import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { db } from '#/server/db/index'
import { chapters } from '#/server/db/schema'
import { requireUserId } from '#/server/functions/auth.helpers'
import type { Chapter } from '#/utils/types'

type UpdateChapterInput = {
  id: number
  title: string
  description: string
}

function validateUpdateChapterInput(data: UpdateChapterInput): UpdateChapterInput {
  const title = data.title.trim()

  if (title.length === 0) {
    throw new Error('Title is required')
  }

  return {
    id: data.id,
    title,
    description: data.description.trim(),
  }
}

export const updateChapter = createServerFn({
  method: 'POST',
})
  .validator(validateUpdateChapterInput)
  .handler(async ({ data }): Promise<Chapter> => {
    const userId = await requireUserId()

    const chapter = await db.query.chapters.findFirst({
      where: eq(chapters.id, data.id),
      with: {
        course: { columns: { authorId: true } },
      },
    })

    if (!chapter) {
      throw new Error('Chapter not found')
    }

    if (chapter.course.authorId !== userId) {
      throw redirect({ to: '/courses' })
    }

    const [updated] = await db
      .update(chapters)
      .set({ title: data.title, description: data.description })
      .where(eq(chapters.id, data.id))
      .returning()

    return updated
  })
