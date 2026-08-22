import { clerkClient } from '@clerk/tanstack-react-start/server'
import { notFound, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { asc, desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '#/server/db/client'
import { chapters, courses, lessons, users } from '#/server/db/schema'
import { requireUserId } from '#/server/functions/auth.server'
import { validateInput } from '#/server/functions/validation.helpers'
import type { Course, CourseWithChapters } from '#/utils/types'

const courseIdSchema = z.number().int('Course id is required')

const createCourseSchema = z.object({
  title: z.string().trim().nonempty('Title is required'),
  subtitle: z.string().trim().nonempty('Subtitle is required'),
  description: z.string().trim(),
})

type CreateCourseInput = z.input<typeof createCourseSchema>

async function ensureAuthor(userId: string): Promise<void> {
  const user = await clerkClient().users.getUser(userId)

  await db
    .insert(users)
    .values({
      id: userId,
      email: user.primaryEmailAddress?.emailAddress ?? null,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    })
    .onConflictDoNothing()
}

export const getCourse = createServerFn({
  method: 'GET',
})
  .validator((data: number) => validateInput(courseIdSchema, data))
  .handler(async ({ data }): Promise<Course> => {
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, data),
    })

    if (!course) {
      throw notFound()
    }

    return course
  })

export const getAuthoredCourse = createServerFn({
  method: 'GET',
})
  .validator((data: number) => validateInput(courseIdSchema, data))
  .handler(async ({ data }): Promise<Course> => {
    const userId = await requireUserId()

    const course = await db.query.courses.findFirst({
      where: eq(courses.id, data),
    })

    if (!course) {
      throw notFound()
    }

    if (course.authorId !== userId) {
      throw redirect({ to: '/courses' })
    }

    return course
  })

export const getAuthoredCourseWithChapters = createServerFn({
  method: 'GET',
})
  .validator((data: number) => validateInput(courseIdSchema, data))
  .handler(async ({ data }): Promise<CourseWithChapters> => {
    const userId = await requireUserId()

    const course = await db.query.courses.findFirst({
      where: eq(courses.id, data),
      with: {
        chapters: {
          orderBy: asc(chapters.position),
          with: {
            lessons: {
              columns: { id: true, title: true, durationSec: true },
              orderBy: asc(lessons.position),
            },
          },
        },
      },
    })

    if (!course) {
      throw notFound()
    }

    if (course.authorId !== userId) {
      throw redirect({ to: '/courses' })
    }

    return course
  })

export const getAuthoredCourses = createServerFn({
  method: 'GET',
}).handler(async (): Promise<Course[]> => {
  const userId = await requireUserId()

  return db.query.courses.findMany({
    where: eq(courses.authorId, userId),
    orderBy: desc(courses.updatedAt),
  })
})

export const createCourse = createServerFn({
  method: 'POST',
})
  .validator((data: CreateCourseInput) => validateInput(createCourseSchema, data))
  .handler(async ({ data }): Promise<Course> => {
    const userId = await requireUserId()

    await ensureAuthor(userId)

    const [course] = await db
      .insert(courses)
      .values({
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        authorId: userId,
      })
      .returning()

    return course
  })
