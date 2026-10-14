import { type Dispatch, type ReactNode, type SetStateAction, useCallback, useRef } from 'react'
import { LessonMoveContext, type LessonMoveTarget } from '@/hooks/use-lesson-move'
import { useSaveLessonOrders } from '@/hooks/use-save-lesson-orders'
import type { CourseOutline } from '@/types'
import { moveLessonToParent } from '@/utils/outline-helpers'

type LessonMoveProviderProps = {
  outline: CourseOutline
  onOutlineChange: Dispatch<SetStateAction<CourseOutline>>
  children: ReactNode
}

export default function LessonMoveProvider({
  outline,
  onOutlineChange,
  children,
}: LessonMoveProviderProps): React.JSX.Element {
  const saveLessonOrders = useSaveLessonOrders(onOutlineChange)
  const focusLessonId = useRef<number | null>(null)

  const targets: LessonMoveTarget[] = [
    { chapterId: null, label: 'Course-level lessons' },
    ...outline.chapters.map((c, i) => ({ chapterId: c.id, label: `Chapter ${i + 1}: ${c.title}` })),
  ]

  async function moveLesson(lessonId: number, chapterId: number | null): Promise<void> {
    const moved = moveLessonToParent(outline, lessonId, chapterId)
    if (moved === outline) {
      return
    }

    focusLessonId.current = lessonId
    onOutlineChange(moved)
    await saveLessonOrders(outline, moved)
  }

  const claimFocus = useCallback((lessonId: number): boolean => {
    if (focusLessonId.current !== lessonId) {
      return false
    }

    focusLessonId.current = null

    return true
  }, [])

  return (
    <LessonMoveContext value={{ targets, moveLesson, claimFocus }}>{children}</LessonMoveContext>
  )
}
