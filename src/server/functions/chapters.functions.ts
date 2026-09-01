import { notFound, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '#/server/db/client'
import { chapters } from '#/server/db/schema'
import { requireUserId } from '#/server/functions/auth.server'
import { validateInput } from '#/server/functions/validation.helpers'
import type { Chapter } from '#/types'

const updateChapterSchema = z.object({
  id: z.number().int('Chapter id is required'),
  title: z.string().trim().nonempty('Title is required'),
  description: z.string().trim(),
})

type UpdateChapterInput = z.input<typeof updateChapterSchema>

export const updateChapter = createServerFn({
  method: 'POST',
})
  .validator((data: UpdateChapterInput) => validateInput(updateChapterSchema, data))
  .handler(async ({ data }): Promise<Chapter> => {
    const userId = await requireUserId()

    const chapter = await db.query.chapters.findFirst({
      where: eq(chapters.id, data.id),
      with: {
        course: { columns: { authorId: true } },
      },
    })

    if (!chapter) {
      throw notFound()
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
