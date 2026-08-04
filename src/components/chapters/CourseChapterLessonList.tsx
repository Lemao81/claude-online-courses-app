import { Stack, Text } from '@chakra-ui/react'
import CourseChapterLessonListItem from '#/components/chapters/CourseChapterLessonListItem'
import { lessonEmptyStyles } from '#/utils/styles/chapterStyles'
import type { ChapterLessonVideo } from '#/utils/types'

type CourseChapterLessonListProps = {
  lessons: ChapterLessonVideo[]
}

export default function CourseChapterLessonList({ lessons }: CourseChapterLessonListProps) {
  if (lessons.length === 0) {
    return <Text css={lessonEmptyStyles}>No lessons in this chapter yet.</Text>
  }

  return (
    <Stack gap="2">
      {lessons.map((l) => (
        <CourseChapterLessonListItem key={l.id} lesson={l} />
      ))}
    </Stack>
  )
}
