'use client'

import { useRouter } from '@tanstack/react-router'
import type { Dispatch, SetStateAction } from 'react'
import { showErrorToast } from '@/components/ui/AppToaster'
import { reorderLessons } from '@/server/functions/lessons-functions'
import type { CourseOutline } from '@/types'
import { getChangedLessonOrders } from '@/utils/outline-helpers'

export function useSaveLessonOrders(
  onOutlineChange: Dispatch<SetStateAction<CourseOutline>>,
): (before: CourseOutline, after: CourseOutline) => Promise<void> {
  const router = useRouter()

  return async (before, after) => {
    const orders = getChangedLessonOrders(before, after)
    if (orders.length === 0) {
      return
    }

    try {
      await reorderLessons({ data: { courseId: after.id, orders } })
    } catch (error) {
      console.error(error)
      onOutlineChange(before)
      showErrorToast(
        'The lesson order was not saved',
        error instanceof Error ? error.message : 'Failed to reorder the lessons',
      )
    }

    await router.invalidate()
  }
}
