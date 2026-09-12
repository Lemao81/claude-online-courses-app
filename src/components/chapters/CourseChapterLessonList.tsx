import { Stack, Text } from '@chakra-ui/react'
import CourseChapterLessonListItem from '#/components/chapters/CourseChapterLessonListItem'
import type { ChapterLessonVideo } from '#/types'

type CourseChapterLessonListProps = {
  lessons: ChapterLessonVideo[]
}

export default function CourseChapterLessonList({ lessons }: CourseChapterLessonListProps) {
  if (lessons.length === 0) {
    return (
      <Text layerStyle="emptyStateRow" textStyle="emptyState">
        No lessons in this chapter yet.
      </Text>
    )
  }

  return (
    <Stack gap="2">
      {lessons.map((l) => (
        <CourseChapterLessonListItem key={l.id} lesson={l} />
      ))}
    </Stack>
  )
}
