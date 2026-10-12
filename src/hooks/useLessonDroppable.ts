'use client'

import { CollisionPriority } from '@dnd-kit/abstract'
import { useDroppable } from '@dnd-kit/react'
import { lessonDragType } from '#/constants'
import { toLessonGroup } from '#/utils/outlineHelpers'

export function useLessonDroppable(chapterId: number | null): (element: Element | null) => void {
  const { ref } = useDroppable({
    id: toLessonGroup(chapterId),
    accept: lessonDragType,
    collisionPriority: CollisionPriority.Low,
  })

  return ref
}
