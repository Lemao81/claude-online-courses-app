import { Button, Flex, Stack, Text } from '@chakra-ui/react'
import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { LuPencil, LuTrash2 } from 'react-icons/lu'
import ChapterLessonList from '#/components/chapters/ChapterLessonList'
import ChapterTitle from '#/components/chapters/ChapterTitle'
import ConfirmDialog from '#/components/ui/ConfirmDialog'
import Tooltip from '#/components/ui/Tooltip'
import { deleteChapter } from '#/server/functions/chapters.functions'
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
  const router = useRouter()
  const [isRemoveOpen, setIsRemoveOpen] = useState(false)

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
        <ChapterTitle chapter={chapter} number={number} lessonCount={lessons.length} />
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
        <ChapterLessonList chapterId={chapter.id} lessons={lessons} />
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
