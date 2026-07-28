import { auth } from '@clerk/tanstack-react-start/server'
import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

export const requireSignedIn = createServerFn({
  method: 'GET',
}).handler(async (): Promise<{ userId: string }> => {
  const { userId } = await auth()

  if (!userId) {
    throw redirect({ to: '/' })
  }

  return { userId }
})
