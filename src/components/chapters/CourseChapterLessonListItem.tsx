import { Box, Flex, Stack, Text } from '@chakra-ui/react'
import { LuVideo } from 'react-icons/lu'
import { formatDuration } from '#/utils/formatters'
import { lessonIconStyles } from '#/utils/styles/chapterStyles'
import { rowStyles } from '#/utils/styles/surfaceStyles'
import { itemTitleStyles, metaStyles } from '#/utils/styles/textStyles'
import type { ChapterLessonVideo } from '#/utils/types'

type CourseChapterLessonListItemProps = {
  lesson: ChapterLessonVideo
}

export default function CourseChapterLessonListItem({ lesson }: CourseChapterLessonListItemProps) {
  return (
    <Flex align="center" gap="3" css={rowStyles}>
      <Box css={lessonIconStyles} aria-hidden="true">
        <LuVideo size={16} />
      </Box>
      <Stack gap="0.5" minW="0">
        <Text css={itemTitleStyles}>{lesson.title}</Text>
        <Text css={metaStyles}>{formatDuration(lesson.durationSec)}</Text>
      </Stack>
    </Flex>
  )
}
