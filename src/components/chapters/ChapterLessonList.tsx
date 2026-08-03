import { Stack, Text } from '@chakra-ui/react'
import ChapterLessonListItem from '#/components/chapters/ChapterLessonListItem'
import { lessonEmptyStyles } from '#/utils/styles/chapterStyles'
import type { ChapterLessonVideo } from '#/utils/types'

type ChapterLessonListProps = {
  lessons: ChapterLessonVideo[]
}

export default function ChapterLessonList({ lessons }: ChapterLessonListProps) {
  if (lessons.length === 0) {
    return <Text css={lessonEmptyStyles}>No lesson videos uploaded yet.</Text>
  }

  return (
    <Stack gap="2">
      {lessons.map((l) => (
        <ChapterLessonListItem key={l.id} lesson={l} />
      ))}
    </Stack>
  )
}
