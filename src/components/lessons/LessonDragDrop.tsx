import { move } from '@dnd-kit/helpers'
import { type DragEndEvent, type DragOverEvent, DragDropProvider } from '@dnd-kit/react'
import { useRouter } from '@tanstack/react-router'
import { type Dispatch, type ReactNode, type SetStateAction, useRef } from 'react'
import { showErrorToast } from '#/components/ui/AppToaster'
import { reorderLessons } from '#/server/functions/lessons.functions'
import type { CourseOutline } from '#/types'
import { getChangedLessonOrders, setLessonGroups, toLessonGroups } from '#/utils/outline-helpers'

type LessonDragDropProps = {
  outline: CourseOutline
  onOutlineChange: Dispatch<SetStateAction<CourseOutline>>
  children: ReactNode
}

export default function LessonDragDrop({
  outline,
  onOutlineChange,
  children,
}: LessonDragDropProps) {
  const router = useRouter()
  const dragStartOutline = useRef<CourseOutline | null>(null)

  function handleDragStart(): void {
    dragStartOutline.current = outline
  }

  function handleDragOver(event: DragOverEvent): void {
    onOutlineChange((current) => {
      const groups = toLessonGroups(current)
      const moved = move(groups, event)

      return moved === groups ? current : setLessonGroups(current, moved)
    })
  }

  async function handleDragEnd({ canceled }: DragEndEvent): Promise<void> {
    const initialOutline = dragStartOutline.current
    dragStartOutline.current = null
    if (!initialOutline) {
      return
    }

    if (canceled) {
      onOutlineChange(initialOutline)

      return
    }

    const orders = getChangedLessonOrders(initialOutline, outline)
    if (orders.length === 0) {
      return
    }

    try {
      await reorderLessons({ data: { courseId: outline.id, orders } })
    } catch (error) {
      console.error(error)
      onOutlineChange(initialOutline)
      showErrorToast(
        'The lesson order was not saved',
        error instanceof Error ? error.message : 'Failed to reorder the lessons',
      )
    }

    await router.invalidate()
  }

  return (
    <DragDropProvider
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DragDropProvider>
  )
}
