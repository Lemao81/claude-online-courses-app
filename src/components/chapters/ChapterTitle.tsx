import { Stack, Text } from '@chakra-ui/react'
import type { Chapter } from '#/types'
import { formatDuration } from '#/utils/formatters'

type ChapterTitleProps = {
  chapter: Chapter
  number: number
  lessonCount: number
}

export default function ChapterTitle({ chapter, number, lessonCount }: ChapterTitleProps) {
  const meta = [
    `Chapter ${number}`,
    `${lessonCount} ${lessonCount === 1 ? 'lesson' : 'lessons'}`,
    formatDuration(chapter.durationSec),
  ].join(' · ')

  return (
    <Stack gap="1" minW="0">
      <Text textStyle="title">{chapter.title}</Text>
      {chapter.description.length > 0 && <Text textStyle="subtitle">{chapter.description}</Text>}
      <Text textStyle="meta">{meta}</Text>
    </Stack>
  )
}
