import { Button } from '@chakra-ui/react'
import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { LuPlus } from 'react-icons/lu'
import { showErrorToast } from '#/components/ui/AppToaster'
import { createLesson } from '#/server/functions/lessons.functions'
import type { Lesson } from '#/types'

type AddLessonButtonProps = {
  courseId: number
  chapterId?: number
  onAdded: (lesson: Lesson) => void
}

export default function AddLessonButton({ courseId, chapterId, onAdded }: AddLessonButtonProps) {
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)

  async function handleAdd(): Promise<void> {
    setIsAdding(true)
    let lesson: Lesson
    try {
      lesson = await createLesson({ data: { courseId, chapterId } })
    } catch (error) {
      console.error(error)
      showErrorToast(
        'No lesson was added',
        error instanceof Error ? error.message : 'Failed to add the lesson',
      )
      setIsAdding(false)

      return
    }

    onAdded(lesson)
    await router.invalidate()
    setIsAdding(false)
  }

  return (
    <Button
      type="button"
      variant="chip"
      loading={isAdding}
      onClick={handleAdd}
    >
      <LuPlus aria-hidden="true" />
      Add lesson
    </Button>
  )
}
