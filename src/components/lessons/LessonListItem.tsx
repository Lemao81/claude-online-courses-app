import { CloseButton, Flex, Stack, Text } from '@chakra-ui/react'
import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { LuVideo } from 'react-icons/lu'
import LessonMoveMenu from '@/components/lessons/LessonMoveMenu'
import LessonVideoButton from '@/components/lessons/LessonVideoButton'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import DragHandle from '@/components/ui/DragHandle'
import EditableText from '@/components/ui/EditableText'
import ErrorText from '@/components/ui/ErrorText'
import IconTile from '@/components/ui/IconTile'
import Tooltip from '@/components/ui/Tooltip'
import { useLessonSortable } from '@/hooks/use-lesson-sortable'
import { deleteLesson, updateLessonTitle } from '@/server/functions/lessons-functions'
import type { LessonVideo } from '@/types'
import { formatDuration } from '@/utils/formatters'
import { toLessonElementId } from '@/utils/outline-helpers'

type LessonListItemProps = {
  courseId: number
  lesson: LessonVideo
  index: number
  chapterId: number | null
  isNew?: boolean
}

export default function LessonListItem({
  courseId,
  lesson,
  index,
  chapterId,
  isNew,
}: LessonListItemProps): React.JSX.Element {
  const router = useRouter()
  const [titleError, setTitleError] = useState('')
  const [isRemoveOpen, setIsRemoveOpen] = useState(false)
  const { ref, handleRef } = useLessonSortable(lesson.id, index, chapterId)

  function handleRemove(): void {
    setIsRemoveOpen(true)
  }

  async function handleRemoveConfirm(): Promise<void> {
    await deleteLesson({ data: { id: lesson.id } })
    await router.invalidate()
  }

  async function handleTitleSubmit(title: string): Promise<void> {
    setTitleError('')
    try {
      await updateLessonTitle({ data: { id: lesson.id, title } })
    } catch (error) {
      console.error(error)
      setTitleError(error instanceof Error ? error.message : 'Failed to save the lesson title')

      return
    }

    await router.invalidate()
  }

  return (
    <Flex
      ref={ref}
      id={toLessonElementId(lesson.id)}
      tabIndex={-1}
      align="center"
      justify="space-between"
      gap="3"
      layerStyle="row"
    >
      <Flex align="center" gap="3" minW="0" flex="1">
        <DragHandle ref={handleRef} label={`Reorder ${lesson.title}`} />
        <IconTile>
          <LuVideo size={20} />
        </IconTile>
        <Stack gap="0.5" minW="0" flex="1">
          <EditableText value={lesson.title} defaultEdit={isNew} onSubmit={handleTitleSubmit} />
          <Text textStyle="meta" px="0.6rem">
            {formatDuration(lesson.durationSec)}
          </Text>
          <ErrorText message={titleError} css={{ px: '0.6rem' }} />
        </Stack>
      </Flex>
      <LessonVideoButton courseId={courseId} lesson={lesson} />
      <LessonMoveMenu lesson={lesson} chapterId={chapterId} />
      <Tooltip content="Remove" showArrow>
        <CloseButton
          size="sm"
          variant="quiet"
          _icon={{ boxSize: '5' }}
          aria-label={`Remove ${lesson.title}`}
          onClick={handleRemove}
        />
      </Tooltip>
      <ConfirmDialog
        open={isRemoveOpen}
        onOpenChange={setIsRemoveOpen}
        title="Remove Lesson"
        question={`Do you really want to remove "${lesson.title}"?`}
        description="The lesson and its video are deleted permanently."
        confirmLabel="Remove"
        onConfirm={handleRemoveConfirm}
      />
    </Flex>
  )
}
