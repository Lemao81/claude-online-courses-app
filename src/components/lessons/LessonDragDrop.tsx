import { type DragEndEvent, DragDropProvider } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import { useRouter } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { showErrorToast } from '#/components/ui/AppToaster'
import { reorderLessons } from '#/server/functions/lessons.functions'
import type { CourseOutline } from '#/types'
import { getParentLessons, moveItem, setParentLessons, toChapterId } from '#/utils/outline'

type LessonDragDropProps = {
  outline: CourseOutline
  onOutlineChange: (outline: CourseOutline) => void
  children: ReactNode
}

export default function LessonDragDrop({
  outline,
  onOutlineChange,
  children,
}: LessonDragDropProps) {
  const router = useRouter()

  async function handleDragEnd({ canceled, operation }: DragEndEvent): Promise<void> {
    const { source } = operation
    if (canceled || !isSortable(source)) {
      return
    }

    if (source.group !== source.initialGroup || source.index === source.initialIndex) {
      return
    }

    const chapterId = toChapterId(source.group)
    const parentLessons = getParentLessons(outline, chapterId)
    const lessons = moveItem(parentLessons, source.initialIndex, source.index)
    const lessonIds = lessons.map((l) => l.id)
    onOutlineChange(setParentLessons(outline, chapterId, lessons))
    try {
      await reorderLessons({ data: { courseId: outline.id, orders: [{ chapterId, lessonIds }] } })
    } catch (error) {
      console.error(error)
      onOutlineChange(outline)
      showErrorToast(
        'The lesson order was not saved',
        error instanceof Error ? error.message : 'Failed to reorder the lessons',
      )
    }

    await router.invalidate()
  }

  return <DragDropProvider onDragEnd={handleDragEnd}>{children}</DragDropProvider>
}
