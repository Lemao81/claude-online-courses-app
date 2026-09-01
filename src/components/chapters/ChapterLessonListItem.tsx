import { Box, CloseButton, Flex, Stack, Text } from '@chakra-ui/react'
import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { LuVideo } from 'react-icons/lu'
import ConfirmDialog from '#/components/ui/ConfirmDialog'
import EditableText from '#/components/ui/EditableText'
import ErrorText from '#/components/ui/ErrorText'
import { deleteLesson, updateLessonTitle } from '#/server/functions/lessons.functions'
import { formatDuration } from '#/utils/formatters'
import { subtleIconButtonStyles } from '#/styles/buttonStyles'
import { lessonIconStyles } from '#/styles/chapterStyles'
import { rowStyles } from '#/styles/surfaceStyles'
import { metaStyles } from '#/styles/textStyles'
import type { ChapterLessonVideo } from '#/types'

type ChapterLessonListItemProps = {
  lesson: ChapterLessonVideo
}

export default function ChapterLessonListItem({ lesson }: ChapterLessonListItemProps) {
  const router = useRouter()
  const [titleError, setTitleError] = useState('')
  const [isRemoveOpen, setIsRemoveOpen] = useState(false)

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
    <Flex align="center" justify="space-between" gap="3" css={rowStyles}>
      <Flex align="center" gap="3" minW="0" flex="1">
        <Box css={lessonIconStyles} aria-hidden="true">
          <LuVideo size={16} />
        </Box>
        <Stack gap="0.5" minW="0" flex="1">
          <EditableText value={lesson.title} onSubmit={handleTitleSubmit} />
          <Text css={metaStyles} px="0.6rem">
            {formatDuration(lesson.durationSec)}
          </Text>
          <ErrorText message={titleError} css={{ px: '0.6rem' }} />
        </Stack>
      </Flex>
      <CloseButton
        size="sm"
        variant="plain"
        aria-label={`Remove ${lesson.title}`}
        css={subtleIconButtonStyles}
        onClick={handleRemove}
      />
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
