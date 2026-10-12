import { Stack, Text } from '@chakra-ui/react'
import LessonListItem from '#/components/lessons/LessonListItem'
import { useLessonDroppable } from '#/hooks/useLessonDroppable'
import type { LessonVideo } from '#/types'

type LessonListProps = {
  chapterId: number | null
  lessons: LessonVideo[]
  newLessonId?: number
}

export default function LessonList({ chapterId, lessons, newLessonId }: LessonListProps) {
  const ref = useLessonDroppable(chapterId)

  return (
    <Stack ref={ref} gap="2">
      {lessons.length === 0 ? (
        <Text layerStyle="emptyStateRow" textStyle="emptyState">
          No lessons yet.
        </Text>
      ) : (
        lessons.map((l, i) => (
          <LessonListItem
            key={l.id}
            lesson={l}
            index={i}
            chapterId={chapterId}
            isNew={l.id === newLessonId}
          />
        ))
      )}
    </Stack>
  )
}
