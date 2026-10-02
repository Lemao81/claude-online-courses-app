import { Stack, Text } from '@chakra-ui/react'
import CourseChapterLessonListItem from '#/components/chapters/CourseChapterLessonListItem'
import type { LessonVideo } from '#/types'

type CourseChapterLessonListProps = {
  chapterId: number
  lessons: LessonVideo[]
}

export default function CourseChapterLessonList({
  chapterId,
  lessons,
}: CourseChapterLessonListProps) {
  if (lessons.length === 0) {
    return (
      <Text layerStyle="emptyStateRow" textStyle="emptyState">
        No lessons in this chapter yet.
      </Text>
    )
  }

  return (
    <Stack gap="2">
      {lessons.map((l, i) => (
        <CourseChapterLessonListItem key={l.id} lesson={l} index={i} chapterId={chapterId} />
      ))}
    </Stack>
  )
}
