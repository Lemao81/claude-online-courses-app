import { notFound, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '#/server/db'
import { lessons } from '#/server/db/schema'
import { requireUserId } from '#/server/functions/auth.server'
import { validateInput } from '#/server/functions/validation.helpers'
import type { Lesson } from '#/utils/types'

const updateLessonTitleSchema = z.object({
  id: z.number().int('Lesson id is required'),
  title: z.string().trim().nonempty('Title is required'),
})

type UpdateLessonTitleInput = z.input<typeof updateLessonTitleSchema>

export const updateLessonTitle = createServerFn({
  method: 'POST',
})
  .validator((data: UpdateLessonTitleInput) => validateInput(updateLessonTitleSchema, data))
  .handler(async ({ data }): Promise<Lesson> => {
    const userId = await requireUserId()

    const lesson = await db.query.lessons.findFirst({
      where: eq(lessons.id, data.id),
      with: {
        course: { columns: { authorId: true } },
      },
    })

    if (!lesson) {
      throw notFound()
    }

    if (lesson.course.authorId !== userId) {
      throw redirect({ to: '/courses' })
    }

    const [updated] = await db
      .update(lessons)
      .set({ title: data.title })
      .where(eq(lessons.id, data.id))
      .returning()

    return updated
  })
