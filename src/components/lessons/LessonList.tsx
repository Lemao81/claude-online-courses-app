import { Stack, Text } from '@chakra-ui/react'
import LessonListItem from '#/components/lessons/LessonListItem'
import type { LessonVideo } from '#/types'

type LessonListProps = {
  chapterId: number | null
  lessons: LessonVideo[]
  newLessonId?: number
}

export default function LessonList({ chapterId, lessons, newLessonId }: LessonListProps) {
  if (lessons.length === 0) {
    return (
      <Text layerStyle="emptyStateRow" textStyle="emptyState">
        No lessons yet.
      </Text>
    )
  }

  return (
    <Stack gap="2">
      {lessons.map((l, i) => (
        <LessonListItem
          key={l.id}
          lesson={l}
          index={i}
          chapterId={chapterId}
          isNew={l.id === newLessonId}
        />
      ))}
    </Stack>
  )
}
