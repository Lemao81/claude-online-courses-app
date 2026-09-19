import { Button, Flex, Stack, Text } from '@chakra-ui/react'
import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { LuPencil, LuTrash2 } from 'react-icons/lu'
import CourseChapterLessonList from '#/components/chapters/CourseChapterLessonList'
import ConfirmDialog from '#/components/ui/ConfirmDialog'
import Tooltip from '#/components/ui/Tooltip'
import { deleteChapter } from '#/server/functions/chapters.functions'
import type { Chapter, LessonVideo } from '#/types'
import { formatDuration } from '#/utils/formatters'

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
  const router = useRouter()
  const [isRemoveOpen, setIsRemoveOpen] = useState(false)

  const meta = [
    `Chapter ${number}`,
    `${lessons.length} ${lessons.length === 1 ? 'lesson' : 'lessons'}`,
    formatDuration(chapter.durationSec),
  ].join(' · ')
  const movedLessons =
    lessons.length === 1 ? 'Its lesson moves' : `Its ${lessons.length} lessons move`
  const moveNote =
    lessons.length > 0 ? `${movedLessons} to the end of the course-level lessons.` : undefined

  async function handleRemoveConfirm(): Promise<void> {
    await deleteChapter({ data: { id: chapter.id } })
    await router.invalidate()
  }

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
        <Flex gap="2">
          <Tooltip content="Edit" showArrow>
            <Button variant="chipIcon" aria-label="Edit chapter" onClick={onEdit}>
              <LuPencil aria-hidden="true" />
            </Button>
          </Tooltip>
          <Tooltip content="Remove" showArrow>
            <Button
              variant="chipIcon"
              aria-label="Remove chapter"
              onClick={() => setIsRemoveOpen(true)}
            >
              <LuTrash2 aria-hidden="true" />
            </Button>
          </Tooltip>
        </Flex>
      </Flex>
      <Stack gap="2">
        <Text textStyle="sectionLabel">Lesson Videos</Text>
        <CourseChapterLessonList lessons={lessons} />
      </Stack>
      <ConfirmDialog
        open={isRemoveOpen}
        onOpenChange={setIsRemoveOpen}
        title="Remove Chapter"
        question={`Do you really want to remove "${chapter.title}"?`}
        description={moveNote}
        confirmLabel="Remove"
        onConfirm={handleRemoveConfirm}
      />
    </Stack>
  )
}
