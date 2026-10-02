'use client'

import { useSortable } from '@dnd-kit/react/sortable'
import { toLessonGroup } from '#/utils/outline'

type LessonSortable = {
  ref: (element: Element | null) => void
  handleRef: (element: Element | null) => void
}

export function useLessonSortable(
  id: number,
  index: number,
  chapterId: number | null,
): LessonSortable {
  const group = toLessonGroup(chapterId)
  const type = `lesson-${group}`
  const { ref, handleRef } = useSortable({ id, index, group, type, accept: type })

  return { ref, handleRef }
}
