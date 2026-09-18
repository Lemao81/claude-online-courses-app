import { Stack, Text } from '@chakra-ui/react'
import LessonListItem from '#/components/lessons/LessonListItem'
import type { LessonVideo } from '#/types'

type LessonListProps = {
  lessons: LessonVideo[]
  newLessonId?: number
}

export default function LessonList({ lessons, newLessonId }: LessonListProps) {
  if (lessons.length === 0) {
    return (
      <Text layerStyle="emptyStateRow" textStyle="emptyState">
        No lessons yet.
      </Text>
    )
  }

  return (
    <Stack gap="2">
      {lessons.map((l) => (
        <LessonListItem key={l.id} lesson={l} isNew={l.id === newLessonId} />
      ))}
    </Stack>
  )
}
