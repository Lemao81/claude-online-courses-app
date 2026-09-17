import { Stack, Text } from '@chakra-ui/react'
import LessonListItem from '#/components/lessons/LessonListItem'
import type { LessonVideo } from '#/types'

type LessonListProps = {
  lessons: LessonVideo[]
}

export default function LessonList({ lessons }: LessonListProps) {
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
        <LessonListItem key={l.id} lesson={l} />
      ))}
    </Stack>
  )
}
