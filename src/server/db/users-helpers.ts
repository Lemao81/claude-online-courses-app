import { clerkClient } from '@clerk/tanstack-react-start/server'
import type { users } from '@/server/db/schema'

export type UserValues = typeof users.$inferInsert

export async function fetchUserValues(userId: string): Promise<UserValues> {
  const user = await clerkClient().users.getUser(userId)

  return {
    id: userId,
    email: user.primaryEmailAddress?.emailAddress ?? null,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
  }
}
