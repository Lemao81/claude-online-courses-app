import { Button, Flex, Stack, Text } from '@chakra-ui/react'
import { LuPencil } from 'react-icons/lu'
import CourseChapterLessonList from '#/components/chapters/CourseChapterLessonList'
import Tooltip from '#/components/ui/Tooltip'
import { formatDuration } from '#/utils/formatters'
import {
  chapterDescriptionStyles,
  chapterEditButtonStyles,
  chapterMetaStyles,
  chapterPanelStyles,
  chapterSectionLabelStyles,
  chapterTitleStyles,
} from '#/utils/styles/chapterStyles'
import type { Chapter, ChapterLessonVideo } from '#/utils/types'

type CourseChapterProps = {
  chapter: Chapter
  lessons?: ChapterLessonVideo[]
}

export default function CourseChapter({ chapter, lessons = [] }: CourseChapterProps) {
  const meta = [
    `Chapter ${chapter.position + 1}`,
    `${lessons.length} ${lessons.length === 1 ? 'lesson' : 'lessons'}`,
    formatDuration(chapter.durationSec),
  ].join(' · ')

  function handleEdit(): void {
    return
  }

  return (
    <Stack gap="5" css={chapterPanelStyles}>
      <Flex align="flex-start" justify="space-between" gap="4">
        <Stack gap="1" minW="0">
          <Text css={chapterTitleStyles}>{chapter.title}</Text>
          {chapter.description.length > 0 && (
            <Text css={chapterDescriptionStyles}>{chapter.description}</Text>
          )}
          <Text css={chapterMetaStyles}>{meta}</Text>
        </Stack>
        <Tooltip content="Edit" showArrow>
          <Button
            variant="plain"
            aria-label="Edit chapter"
            css={chapterEditButtonStyles}
            onClick={handleEdit}
          >
            <LuPencil aria-hidden="true" />
          </Button>
        </Tooltip>
      </Flex>
      <Stack gap="2">
        <Text css={chapterSectionLabelStyles}>Lesson Videos</Text>
        <CourseChapterLessonList lessons={lessons} />
      </Stack>
    </Stack>
  )
}
