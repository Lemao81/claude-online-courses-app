import { Stack, Text } from '@chakra-ui/react'
import ChapterLessonListItem from '#/components/chapters/ChapterLessonListItem'
import type { ChapterLessonVideo } from '#/types'

type ChapterLessonListProps = {
  lessons: ChapterLessonVideo[]
}

export default function ChapterLessonList({ lessons }: ChapterLessonListProps) {
  if (lessons.length === 0) {
    return (
      <Text layerStyle="emptyStateRow" textStyle="emptyState">
        No lesson videos uploaded yet.
      </Text>
    )
  }

  return (
    <Stack gap="2">
      {lessons.map((l) => (
        <ChapterLessonListItem key={l.id} lesson={l} />
      ))}
    </Stack>
  )
}
