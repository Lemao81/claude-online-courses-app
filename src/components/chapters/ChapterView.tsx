import { Flex, Stack, Text } from '@chakra-ui/react'
import ChapterActions from '#/components/chapters/ChapterActions'
import ChapterLessonList from '#/components/chapters/ChapterLessonList'
import ChapterTitle from '#/components/chapters/ChapterTitle'
import DragHandle from '#/components/ui/DragHandle'
import type { Chapter, LessonVideo } from '#/types'

type ChapterViewProps = {
  chapter: Chapter
  number: number
  lessons?: LessonVideo[]
  handleRef: (element: Element | null) => void
  onEdit: () => void
}

export default function ChapterView({
  chapter,
  number,
  lessons = [],
  handleRef,
  onEdit,
}: ChapterViewProps) {
  return (
    <Stack gap="5" layerStyle="chapterPanel">
      <Flex align="flex-start" justify="space-between" gap="4">
        <Flex align="flex-start" gap="4" minW="0">
          <DragHandle ref={handleRef} label={`Reorder ${chapter.title}`} />
          <ChapterTitle chapter={chapter} number={number} lessonCount={lessons.length} />
        </Flex>
        <ChapterActions chapter={chapter} lessonCount={lessons.length} onEdit={onEdit} />
      </Flex>
      <Stack gap="2">
        <Text textStyle="sectionLabel">Lesson Videos</Text>
        <ChapterLessonList chapterId={chapter.id} lessons={lessons} />
      </Stack>
    </Stack>
  )
}
