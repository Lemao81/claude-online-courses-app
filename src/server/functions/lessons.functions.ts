import { notFound, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { db } from '#/server/db'
import { lessons } from '#/server/db/schema'
import { requireUserId } from '#/server/functions/auth.server'
import type { Lesson } from '#/utils/types'

type UpdateLessonTitleInput = {
  id: number
  title: string
}

function validateUpdateLessonTitleInput(data: UpdateLessonTitleInput): UpdateLessonTitleInput {
  if (!Number.isInteger(data.id)) {
    throw new Error('Lesson id is required')
  }

  const title = data.title.trim()

  if (title.length === 0) {
    throw new Error('Title is required')
  }

  return {
    id: data.id,
    title,
  }
}

export const updateLessonTitle = createServerFn({
  method: 'POST',
})
  .validator(validateUpdateLessonTitleInput)
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
