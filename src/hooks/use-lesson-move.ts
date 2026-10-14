'use client'

import { createContext, useContext } from 'react'

export type LessonMoveTarget = {
  chapterId: number | null
  label: string
}

export type LessonMoveContextValue = {
  targets: LessonMoveTarget[]
  moveLesson: (lessonId: number, chapterId: number | null) => Promise<void>
  claimFocus: (lessonId: number) => boolean
}

export const LessonMoveContext = createContext<LessonMoveContextValue | null>(null)

export function useLessonMove(): LessonMoveContextValue {
  const lessonMove = useContext(LessonMoveContext)
  if (!lessonMove) {
    throw new Error('useLessonMove must be used inside LessonMoveProvider')
  }

  return lessonMove
}
