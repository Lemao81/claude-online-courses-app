import { Stack, Text } from '@chakra-ui/react'
import ChapterTitle from '@/components/chapters/ChapterTitle'
import LessonViewList from '@/components/lessons/LessonViewList'
import type { ChapterWithLessons } from '@/types'

type ChapterViewListProps = {
  chapters: ChapterWithLessons[]
}

export default function ChapterViewList({ chapters }: ChapterViewListProps): React.JSX.Element {
  return (
    <Stack gap="4">
      {chapters.map((c, i) => (
        <Stack key={c.id} gap="5" layerStyle="chapterPanel">
          <ChapterTitle chapter={c} number={i + 1} lessonCount={c.lessons.length} />
          <Stack gap="2">
            <Text textStyle="sectionLabel">Lesson Videos</Text>
            <LessonViewList lessons={c.lessons} emptyText="No lessons in this chapter." />
          </Stack>
        </Stack>
      ))}
    </Stack>
  )
}
