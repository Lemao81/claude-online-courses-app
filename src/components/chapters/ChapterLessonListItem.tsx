import { Box, CloseButton, Flex, Stack, Text } from '@chakra-ui/react'
import { LuVideo } from 'react-icons/lu'
import { formatDuration } from '#/utils/formatters'
import {
  lessonIconStyles,
  lessonMetaStyles,
  lessonRemoveButtonStyles,
  lessonRowStyles,
  lessonTitleStyles,
} from '#/utils/styles/chapterStyles'
import type { ChapterLessonVideo } from '#/utils/types'

type ChapterLessonListItemProps = {
  lesson: ChapterLessonVideo
}

export default function ChapterLessonListItem({ lesson }: ChapterLessonListItemProps) {
  function handleRemove(): void {
    return
  }

  return (
    <Flex align="center" justify="space-between" gap="3" css={lessonRowStyles}>
      <Flex align="center" gap="3" minW="0">
        <Box css={lessonIconStyles} aria-hidden="true">
          <LuVideo size={16} />
        </Box>
        <Stack gap="0.5" minW="0">
          <Text css={lessonTitleStyles}>{lesson.title}</Text>
          <Text css={lessonMetaStyles}>{formatDuration(lesson.durationSec)}</Text>
        </Stack>
      </Flex>
      <CloseButton
        size="sm"
        variant="plain"
        aria-label={`Remove ${lesson.title}`}
        css={lessonRemoveButtonStyles}
        onClick={handleRemove}
      />
    </Flex>
  )
}
