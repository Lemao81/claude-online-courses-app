import { Button } from '@chakra-ui/react'
import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { LuPlus } from 'react-icons/lu'
import { showErrorToast } from '#/components/ui/AppToaster'
import { createChapter } from '#/server/functions/chapters.functions'
import type { Chapter } from '#/types'

type AddChapterButtonProps = {
  courseId: number
  onAdded: (chapter: Chapter) => void
}

export default function AddChapterButton({ courseId, onAdded }: AddChapterButtonProps) {
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)

  async function handleAdd(): Promise<void> {
    setIsAdding(true)
    let chapter: Chapter
    try {
      chapter = await createChapter({ data: { courseId } })
    } catch (error) {
      console.error(error)
      showErrorToast(
        'No chapter was added',
        error instanceof Error ? error.message : 'Failed to add the chapter',
      )
      setIsAdding(false)

      return
    }

    onAdded(chapter)
    await router.invalidate()
    setIsAdding(false)
  }

  return (
    <Button
      type="button"
      variant="chip"
      alignSelf="flex-start"
      loading={isAdding}
      onClick={handleAdd}
    >
      <LuPlus aria-hidden="true" />
      Add chapter
    </Button>
  )
}
