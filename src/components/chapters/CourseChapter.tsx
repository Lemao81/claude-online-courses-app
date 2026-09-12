import { Button, Flex, Stack, Text } from '@chakra-ui/react'
import { LuPencil } from 'react-icons/lu'
import CourseChapterLessonList from '#/components/chapters/CourseChapterLessonList'
import Tooltip from '#/components/ui/Tooltip'
import type { Chapter, ChapterLessonVideo } from '#/types'
import { formatDuration } from '#/utils/formatters'

type CourseChapterProps = {
  chapter: Chapter
  lessons?: ChapterLessonVideo[]
  onEdit: () => void
}

export default function CourseChapter({ chapter, lessons = [], onEdit }: CourseChapterProps) {
  const meta = [
    `Chapter ${chapter.position + 1}`,
    `${lessons.length} ${lessons.length === 1 ? 'lesson' : 'lessons'}`,
    formatDuration(chapter.durationSec),
  ].join(' · ')

  return (
    <Stack gap="5" layerStyle="chapterPanel">
      <Flex align="flex-start" justify="space-between" gap="4">
        <Stack gap="1" minW="0">
          <Text textStyle="title">{chapter.title}</Text>
          {chapter.description.length > 0 && (
            <Text textStyle="subtitle">{chapter.description}</Text>
          )}
          <Text textStyle="meta">{meta}</Text>
        </Stack>
        <Tooltip content="Edit" showArrow>
          <Button variant="chipIcon" aria-label="Edit chapter" onClick={onEdit}>
            <LuPencil aria-hidden="true" />
          </Button>
        </Tooltip>
      </Flex>
      <Stack gap="2">
        <Text textStyle="sectionLabel">Lesson Videos</Text>
        <CourseChapterLessonList lessons={lessons} />
      </Stack>
    </Stack>
  )
}
