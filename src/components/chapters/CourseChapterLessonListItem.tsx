import { Flex, Stack, Text } from '@chakra-ui/react'
import { LuVideo } from 'react-icons/lu'
import IconTile from '#/components/ui/IconTile'
import { formatDuration } from '#/utils/formatters'
import type { ChapterLessonVideo } from '#/types'

type CourseChapterLessonListItemProps = {
  lesson: ChapterLessonVideo
}

export default function CourseChapterLessonListItem({ lesson }: CourseChapterLessonListItemProps) {
  return (
    <Flex align="center" gap="3" layerStyle="row">
      <IconTile>
        <LuVideo size={16} />
      </IconTile>
      <Stack gap="0.5" minW="0">
        <Text textStyle="itemTitle">{lesson.title}</Text>
        <Text textStyle="meta">{formatDuration(lesson.durationSec)}</Text>
      </Stack>
    </Flex>
  )
}
