'use client'

import { useSortable } from '@dnd-kit/react/sortable'
import { chapterDragType } from '#/constants'
import { toChapterSortableId } from '#/utils/outlineHelpers'

type ChapterSortable = {
  ref: (element: Element | null) => void
  handleRef: (element: Element | null) => void
}

export function useChapterSortable(id: number, index: number): ChapterSortable {
  const { ref, handleRef } = useSortable({
    id: toChapterSortableId(id),
    index,
    type: chapterDragType,
    accept: chapterDragType,
  })

  return { ref, handleRef }
}
