import { clerkClient } from '@clerk/tanstack-react-start/server'
import type { UserValues } from '@/server/types'

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
