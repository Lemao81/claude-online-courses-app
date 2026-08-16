import { Box, CloseButton, Flex, Stack, Text } from '@chakra-ui/react'
import { LuVideo } from 'react-icons/lu'
import EditableText from '#/components/ui/EditableText'
import { formatDuration } from '#/utils/formatters'
import { subtleIconButtonStyles } from '#/utils/styles/buttonStyles'
import { lessonIconStyles } from '#/utils/styles/chapterStyles'
import { rowStyles } from '#/utils/styles/surfaceStyles'
import { metaStyles } from '#/utils/styles/textStyles'
import type { ChapterLessonVideo } from '#/utils/types'

type ChapterLessonListItemProps = {
  lesson: ChapterLessonVideo
}

export default function ChapterLessonListItem({ lesson }: ChapterLessonListItemProps) {
  function handleRemove(): void {
    return
  }

  function handleTitleSubmit(): void {
    return
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
