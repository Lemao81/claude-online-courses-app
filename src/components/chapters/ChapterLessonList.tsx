import { Stack, Text } from '@chakra-ui/react'
import ChapterLessonListItem from '#/components/chapters/ChapterLessonListItem'
import { useLessonDroppable } from '#/hooks/use-lesson-droppable'
import type { LessonVideo } from '#/types'

type ChapterLessonListProps = {
  chapterId: number
  lessons: LessonVideo[]
}

export default function ChapterLessonList({
  chapterId,
  lessons,
}: ChapterLessonListProps): React.JSX.Element {
  const ref = useLessonDroppable(chapterId)

  return (
    <Stack ref={ref} gap="2">
      {lessons.length === 0 ? (
        <Text layerStyle="emptyStateRow" textStyle="emptyState">
          No lessons in this chapter yet.
        </Text>
      ) : (
        lessons.map((l, i) => (
          <ChapterLessonListItem key={l.id} lesson={l} index={i} chapterId={chapterId} />
        ))
      )}
    </Stack>
  )
}
