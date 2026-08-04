import { auth, clerkClient } from '@clerk/tanstack-react-start/server'
import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { asc, desc, eq } from 'drizzle-orm'
import { db } from '#/server/db/index'
import { chapters, courses, users } from '#/server/db/schema'
import type { Course, CourseWithChapters } from '#/utils/types'

type CreateCourseInput = {
  title: string
  subtitle: string
  description: string
}

function validateCreateCourseInput(data: CreateCourseInput): CreateCourseInput {
  const title = data.title.trim()
  const subtitle = data.subtitle.trim()

  if (title.length === 0) {
    throw new Error('Title is required')
  }

  if (subtitle.length === 0) {
    throw new Error('Subtitle is required')
  }

  return {
    title,
    subtitle,
    description: data.description.trim(),
  }
}

async function requireUserId(): Promise<string> {
  const { userId } = await auth()

  if (!userId) {
    throw redirect({ to: '/' })
  }

  return userId
}

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
  .validator((i: number) => i)
  .handler(async ({ data }): Promise<Course> => {
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, data),
    })

    if (!course) {
      throw new Error('Course not found')
    }

    return course
  })

export const getAuthoredCourse = createServerFn({
  method: 'GET',
})
  .validator((i: number) => i)
  .handler(async ({ data }): Promise<Course> => {
    const userId = await requireUserId()

    const course = await db.query.courses.findFirst({
      where: eq(courses.id, data),
    })

    if (!course) {
      throw new Error('Course not found')
    }

    if (course.authorId !== userId) {
      throw redirect({ to: '/courses' })
    }

    return course
  })

export const getAuthoredCourseWithChapters = createServerFn({
  method: 'GET',
})
  .validator((i: number) => i)
  .handler(async ({ data }): Promise<CourseWithChapters> => {
    const userId = await requireUserId()

    const course = await db.query.courses.findFirst({
      where: eq(courses.id, data),
      with: {
        chapters: {
          orderBy: asc(chapters.position),
        },
      },
    })

    if (!course) {
      throw new Error('Course not found')
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
  .validator(validateCreateCourseInput)
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
