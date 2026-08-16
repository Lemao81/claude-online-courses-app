import { Box, CloseButton, Flex, Stack, Text } from '@chakra-ui/react'
import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { LuVideo } from 'react-icons/lu'
import EditableText from '#/components/ui/EditableText'
import { updateLessonTitle } from '#/server/functions/lessons.functions'
import { formatDuration } from '#/utils/formatters'
import { subtleIconButtonStyles } from '#/utils/styles/buttonStyles'
import { lessonIconStyles } from '#/utils/styles/chapterStyles'
import { formErrorStyles } from '#/utils/styles/formStyles'
import { rowStyles } from '#/utils/styles/surfaceStyles'
import { metaStyles } from '#/utils/styles/textStyles'
import type { ChapterLessonVideo } from '#/utils/types'

type ChapterLessonListItemProps = {
  lesson: ChapterLessonVideo
}

export default function ChapterLessonListItem({ lesson }: ChapterLessonListItemProps) {
  const router = useRouter()
  const [titleError, setTitleError] = useState('')

  function handleRemove(): void {
    return
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
          {titleError !== '' && (
            <Text css={formErrorStyles} px="0.6rem" role="alert">
              {titleError}
            </Text>
          )}
        </Stack>
      </Flex>
      <CloseButton
        size="sm"
        variant="plain"
        aria-label={`Remove ${lesson.title}`}
        css={subtleIconButtonStyles}
        onClick={handleRemove}
      />
    </Flex>
  )
}
