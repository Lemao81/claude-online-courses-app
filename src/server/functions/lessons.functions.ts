import { notFound, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { and, desc, eq, isNull } from 'drizzle-orm'
import { z } from 'zod'
import { untitledLessonTitle } from '#/config/constants'
import { recomputeCourseDuration } from '#/server/db/aggregates.helpers'
import { db } from '#/server/db/client'
import { assets, chapters, courses, lessons } from '#/server/db/schema'
import { requireUserId } from '#/server/functions/auth.server'
import { validateInput } from '#/server/functions/validation.helpers'
import { enqueueAssetDeletion } from '#/server/jobs/assets.jobs'
import type { Lesson } from '#/types'

const createLessonSchema = z.object({
  courseId: z.number().int('Course id is required'),
  chapterId: z.number().int('Chapter id must be a whole number').nullish(),
  title: z
    .string()
    .trim()
    .optional()
    .transform((t) => (t === undefined || t.length === 0 ? untitledLessonTitle : t)),
})

type CreateLessonInput = z.input<typeof createLessonSchema>

export const createLesson = createServerFn({
  method: 'POST',
})
  .validator((data: CreateLessonInput) => validateInput(createLessonSchema, data))
  .handler(async ({ data }): Promise<Lesson> => {
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

    const chapterId = data.chapterId ?? null

    if (chapterId !== null) {
      const chapter = await db.query.chapters.findFirst({
        where: eq(chapters.id, chapterId),
        columns: { courseId: true },
      })

      if (!chapter || chapter.courseId !== data.courseId) {
        throw notFound()
      }
    }

    const [last] = await db
      .select({ position: lessons.position })
      .from(lessons)
      .where(
        chapterId === null
          ? and(eq(lessons.courseId, data.courseId), isNull(lessons.chapterId))
          : eq(lessons.chapterId, chapterId),
      )
      .orderBy(desc(lessons.position))
      .limit(1)

    const [lesson] = await db
      .insert(lessons)
      .values({
        courseId: data.courseId,
        chapterId,
        position: last ? last.position + 1 : 0,
        title: data.title,
      })
      .returning()

    return lesson
  })

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

      if (video) {
        await enqueueAssetDeletion(tx, video.id)
      }
    })
  })
