import { redirect } from '@tanstack/react-router'
import type { Course } from '@/types'

export function requireEditableCourse(
  course: Pick<Course, 'authorId' | 'status'>,
  userId: string,
): void {
  if (course.authorId !== userId) {
    throw redirect({ to: '/courses' })
  }

  if (course.status === 'archived') {
    throw new Error('An archived course can no longer be changed')
  }
}
