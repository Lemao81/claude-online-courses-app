import { auth, clerkClient } from '@clerk/tanstack-react-start/server'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { db } from '#/server/db/index'
import { courses, users } from '#/server/db/schema'
import type { Course } from '#/utils/types'

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
  .validator((courseId: number) => courseId)
  .handler(async ({ data }): Promise<Course> => {
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, data),
    })

    if (!course) {
      throw new Error('Course not found')
    }

    return course
  })

export const createCourse = createServerFn({
  method: 'POST',
})
  .validator(validateCreateCourseInput)
  .handler(async ({ data }): Promise<Course> => {
    const { userId } = await auth()

    if (!userId) {
      throw new Error('You must be signed in to create a course')
    }

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
