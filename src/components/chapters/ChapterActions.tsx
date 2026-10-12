import { Button, Flex } from '@chakra-ui/react'
import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { LuPencil, LuTrash2 } from 'react-icons/lu'
import ConfirmDialog from '#/components/ui/ConfirmDialog'
import Tooltip from '#/components/ui/Tooltip'
import { deleteChapter } from '#/server/functions/chapters.functions'
import type { Chapter } from '#/types'

type ChapterActionsProps = {
  chapter: Chapter
  lessonCount: number
  onEdit: () => void
}

function getMoveNote(lessonCount: number): string | undefined {
  if (lessonCount === 0) {
    return undefined
  }

  const movedLessons = lessonCount === 1 ? 'Its lesson moves' : `Its ${lessonCount} lessons move`

  return `${movedLessons} to the end of the course-level lessons.`
}

export default function ChapterActions({ chapter, lessonCount, onEdit }: ChapterActionsProps) {
  const router = useRouter()
  const [isRemoveOpen, setIsRemoveOpen] = useState(false)

  async function handleRemoveConfirm(): Promise<void> {
    await deleteChapter({ data: { id: chapter.id } })
    await router.invalidate()
  }

  return (
    <Flex gap="2">
      <Tooltip content="Edit" showArrow>
        <Button variant="chipIcon" aria-label="Edit chapter" onClick={onEdit}>
          <LuPencil aria-hidden="true" />
        </Button>
      </Tooltip>
      <Tooltip content="Remove" showArrow>
        <Button
          variant="chipIcon"
          aria-label="Remove chapter"
          onClick={() => setIsRemoveOpen(true)}
        >
          <LuTrash2 aria-hidden="true" />
        </Button>
      </Tooltip>
      <ConfirmDialog
        open={isRemoveOpen}
        onOpenChange={setIsRemoveOpen}
        title="Remove Chapter"
        question={`Do you really want to remove "${chapter.title}"?`}
        description={getMoveNote(lessonCount)}
        confirmLabel="Remove"
        onConfirm={handleRemoveConfirm}
      />
    </Flex>
  )
}
