import { Flex, Stack, Text } from '@chakra-ui/react'
import ChapterActions from '#/components/chapters/ChapterActions'
import ChapterLessonList from '#/components/chapters/ChapterLessonList'
import ChapterTitle from '#/components/chapters/ChapterTitle'
import type { Chapter, LessonVideo } from '#/types'

type CourseChapterProps = {
  chapter: Chapter
  number: number
  lessons?: LessonVideo[]
  onEdit: () => void
}

export default function CourseChapter({
  chapter,
  number,
  lessons = [],
  onEdit,
}: CourseChapterProps) {
  return (
    <Stack gap="5" layerStyle="chapterPanel">
      <Flex align="flex-start" justify="space-between" gap="4">
        <ChapterTitle chapter={chapter} number={number} lessonCount={lessons.length} />
        <ChapterActions chapter={chapter} lessonCount={lessons.length} onEdit={onEdit} />
      </Flex>
      <Stack gap="2">
        <Text textStyle="sectionLabel">Lesson Videos</Text>
        <ChapterLessonList chapterId={chapter.id} lessons={lessons} />
      </Stack>
    </Stack>
  )
}
