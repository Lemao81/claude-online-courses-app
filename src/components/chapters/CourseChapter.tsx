import { Button, Flex, Stack, Text } from '@chakra-ui/react'
import { LuPencil } from 'react-icons/lu'
import CourseChapterLessonList from '#/components/chapters/CourseChapterLessonList'
import Tooltip from '#/components/ui/Tooltip'
import { formatDuration } from '#/utils/formatters'
import { chipIconButtonStyles } from '#/utils/styles/buttonStyles'
import { chapterPanelStyles, chapterSectionLabelStyles } from '#/utils/styles/chapterStyles'
import { metaStyles, subtitleStyles, titleStyles } from '#/utils/styles/textStyles'
import type { Chapter, ChapterLessonVideo } from '#/utils/types'

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
    <Stack gap="5" css={chapterPanelStyles}>
      <Flex align="flex-start" justify="space-between" gap="4">
        <Stack gap="1" minW="0">
          <Text css={titleStyles}>{chapter.title}</Text>
          {chapter.description.length > 0 && (
            <Text css={subtitleStyles}>{chapter.description}</Text>
          )}
          <Text css={metaStyles}>{meta}</Text>
        </Stack>
        <Tooltip content="Edit" showArrow>
          <Button
            variant="plain"
            aria-label="Edit chapter"
            css={chipIconButtonStyles}
            onClick={onEdit}
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
