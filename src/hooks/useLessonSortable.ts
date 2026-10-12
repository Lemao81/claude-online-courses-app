'use client'

import { useSortable } from '@dnd-kit/react/sortable'
import { lessonDragType } from '#/constants'
import { toLessonGroup } from '#/utils/outlineHelpers'

type LessonSortable = {
  ref: (element: Element | null) => void
  handleRef: (element: Element | null) => void
}

export function useLessonSortable(
  id: number,
  index: number,
  chapterId: number | null,
): LessonSortable {
  const { ref, handleRef } = useSortable({
    id,
    index,
    group: toLessonGroup(chapterId),
    type: lessonDragType,
    accept: lessonDragType,
  })

  return { ref, handleRef }
}
