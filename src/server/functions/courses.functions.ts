import { auth, clerkClient } from '@clerk/tanstack-react-start/server'
import { createServerFn } from '@tanstack/react-start'
import { db } from '#/server/db/index'
import { courses, users } from '#/server/db/schema'

type CreateCourseInput = {
  title: string
  subtitle: string
  description: string
}

function validateCreateCourseInput(data: CreateCourseInput): CreateCourseInput {
  const title = data.title.trim()

  if (title.length === 0) {
    throw new Error('Title is required')
  }

  return {
    title,
    subtitle: data.subtitle.trim(),
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

export const createCourse = createServerFn({
  method: 'POST',
})
  .validator(validateCreateCourseInput)
  .handler(async ({ data }): Promise<typeof courses.$inferSelect> => {
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
