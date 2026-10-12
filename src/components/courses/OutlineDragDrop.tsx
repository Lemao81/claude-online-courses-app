import { arrayMove, move } from '@dnd-kit/helpers'
import { DragDropProvider, type DragEndEvent, type DragOverEvent } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import { useRouter } from '@tanstack/react-router'
import { type Dispatch, type ReactNode, type SetStateAction, useRef } from 'react'
import { showErrorToast } from '#/components/ui/AppToaster'
import { chapterDragType, lessonDragType } from '#/constants'
import { reorderChapters } from '#/server/functions/chapters.functions'
import { reorderLessons } from '#/server/functions/lessons.functions'
import type { CourseOutline } from '#/types'
import { getChangedLessonOrders, setLessonGroups, toLessonGroups } from '#/utils/outlineHelpers'

type OutlineDragDropProps = {
  outline: CourseOutline
  onOutlineChange: Dispatch<SetStateAction<CourseOutline>>
  children: ReactNode
}

export default function OutlineDragDrop({
  outline,
  onOutlineChange,
  children,
}: OutlineDragDropProps): React.JSX.Element {
  const router = useRouter()
  const dragStartOutline = useRef<CourseOutline | null>(null)

  function handleDragStart(): void {
    dragStartOutline.current = outline
  }

  function handleDragOver(event: DragOverEvent): void {
    if (event.operation.source?.type !== lessonDragType) {
      return
    }

    onOutlineChange((current) => {
      const groups = toLessonGroups(current)
      const moved = move(groups, event)

      return moved === groups ? current : setLessonGroups(current, moved)
    })
  }

  async function handleDragEnd({ canceled, operation }: DragEndEvent): Promise<void> {
    const initialOutline = dragStartOutline.current
    dragStartOutline.current = null
    if (!initialOutline) {
      return
    }

    if (canceled) {
      onOutlineChange(initialOutline)

      return
    }

    const { source } = operation
    if (source?.type === chapterDragType && isSortable(source)) {
      await saveChapterOrder(initialOutline, source.initialIndex, source.index)
    } else if (source?.type === lessonDragType) {
      await saveLessonOrders(initialOutline)
    }
  }

  async function saveChapterOrder(
    initialOutline: CourseOutline,
    from: number,
    to: number,
  ): Promise<void> {
    if (from === to) {
      return
    }

    const chapters = arrayMove(initialOutline.chapters, from, to)
    const chapterIds = chapters.map((c) => c.id)
    onOutlineChange({ ...initialOutline, chapters })
    try {
      await reorderChapters({ data: { courseId: initialOutline.id, chapterIds } })
    } catch (error) {
      console.error(error)
      onOutlineChange(initialOutline)
      showErrorToast(
        'The chapter order was not saved',
        error instanceof Error ? error.message : 'Failed to reorder the chapters',
      )
    }

    await router.invalidate()
  }

  async function saveLessonOrders(initialOutline: CourseOutline): Promise<void> {
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
