import { notFound, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '#/server/db'
import { recomputeCourseDuration } from '#/server/db/aggregates.helpers'
import { assets, lessons } from '#/server/db/schema'
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

const deleteLessonSchema = z.object({
  id: z.number().int('Lesson id is required'),
})

type DeleteLessonInput = z.input<typeof deleteLessonSchema>

export const deleteLesson = createServerFn({
  method: 'POST',
})
  .validator((data: DeleteLessonInput) => validateInput(deleteLessonSchema, data))
  .handler(async ({ data }): Promise<void> => {
    const userId = await requireUserId()

    const lesson = await db.query.lessons.findFirst({
      where: eq(lessons.id, data.id),
      with: {
        course: { columns: { authorId: true } },
        videoAsset: { columns: { id: true } },
      },
    })

    if (!lesson) {
      throw notFound()
    }

    if (lesson.course.authorId !== userId) {
      throw redirect({ to: '/courses' })
    }

    const video = lesson.videoAsset

    await db.transaction(async (tx) => {
      await tx.delete(lessons).where(eq(lessons.id, lesson.id))

      if (video) {
        await tx.update(assets).set({ deletedAt: new Date() }).where(eq(assets.id, video.id))
      }

      await recomputeCourseDuration(tx, lesson.courseId)
    })
  })
