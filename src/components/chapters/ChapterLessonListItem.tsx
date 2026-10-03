import { Flex, Stack, Text } from '@chakra-ui/react'
import { LuVideo } from 'react-icons/lu'
import DragHandle from '#/components/ui/DragHandle'
import IconTile from '#/components/ui/IconTile'
import { useLessonSortable } from '#/hooks/useLessonSortable'
import type { LessonVideo } from '#/types'
import { formatDuration } from '#/utils/formatters'

type ChapterLessonListItemProps = {
  lesson: LessonVideo
  index: number
  chapterId: number
}

export default function ChapterLessonListItem({
  lesson,
  index,
  chapterId,
}: ChapterLessonListItemProps) {
  const { ref, handleRef } = useLessonSortable(lesson.id, index, chapterId)

  return (
    <Flex ref={ref} align="center" gap="3" layerStyle="row">
      <DragHandle ref={handleRef} label={`Reorder ${lesson.title}`} />
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
