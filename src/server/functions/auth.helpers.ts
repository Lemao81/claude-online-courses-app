import { auth } from '@clerk/tanstack-react-start/server'
import { redirect } from '@tanstack/react-router'

export async function requireUserId(): Promise<string> {
  const { userId } = await auth()

  if (!userId) {
    throw redirect({ to: '/' })
  }

  return userId
}
