import { Stack, Text } from '@chakra-ui/react'
import CourseChapterLessonListItem from '#/components/chapters/CourseChapterLessonListItem'
import { useLessonDroppable } from '#/hooks/useLessonDroppable'
import type { LessonVideo } from '#/types'

type CourseChapterLessonListProps = {
  chapterId: number
  lessons: LessonVideo[]
}

export default function CourseChapterLessonList({
  chapterId,
  lessons,
}: CourseChapterLessonListProps) {
  const ref = useLessonDroppable(chapterId)

  return (
    <Stack ref={ref} gap="2">
      {lessons.length === 0 ? (
        <Text layerStyle="emptyStateRow" textStyle="emptyState">
          No lessons in this chapter yet.
        </Text>
      ) : (
        lessons.map((l, i) => (
          <CourseChapterLessonListItem key={l.id} lesson={l} index={i} chapterId={chapterId} />
        ))
      )}
    </Stack>
  )
}
