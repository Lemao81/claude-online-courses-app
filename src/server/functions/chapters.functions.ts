import { notFound, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { untitledChapterTitle } from '#/config/constants'
import { db } from '#/server/db/client'
import { chapters, courses } from '#/server/db/schema'
import { requireUserId } from '#/server/functions/auth.server'
import { validateInput } from '#/server/functions/validation.helpers'
import type { Chapter } from '#/types'

const createChapterSchema = z.object({
  courseId: z.number().int('Course id is required'),
  title: z
    .string()
    .trim()
    .optional()
    .transform((t) => (t === undefined || t.length === 0 ? untitledChapterTitle : t)),
})

type CreateChapterInput = z.input<typeof createChapterSchema>

export const createChapter = createServerFn({
  method: 'POST',
})
  .validator((data: CreateChapterInput) => validateInput(createChapterSchema, data))
  .handler(async ({ data }): Promise<Chapter> => {
    const userId = await requireUserId()

    const course = await db.query.courses.findFirst({
      where: eq(courses.id, data.courseId),
      columns: { authorId: true },
    })

    if (!course) {
      throw notFound()
    }

    if (course.authorId !== userId) {
      throw redirect({ to: '/courses' })
    }

    const [last] = await db
      .select({ position: chapters.position })
      .from(chapters)
      .where(eq(chapters.courseId, data.courseId))
      .orderBy(desc(chapters.position))
      .limit(1)

    const [chapter] = await db
      .insert(chapters)
      .values({
        courseId: data.courseId,
        position: last ? last.position + 1 : 0,
        title: data.title,
        description: '',
      })
      .returning()

    return chapter
  })

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
