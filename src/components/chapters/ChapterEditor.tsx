import { Box, CloseButton, Flex, Stack, Text } from '@chakra-ui/react'
import { useRouter } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import ChapterEditorForm, {
  type ChapterEditorFormValues,
  useChapterEditorForm,
} from '#/components/chapters/ChapterEditorForm'
import AddLessonButton from '#/components/lessons/AddLessonButton'
import LessonList from '#/components/lessons/LessonList'
import DragHandle from '#/components/ui/DragHandle'
import VideoUpload from '#/components/videos/VideoUpload'
import { updateChapter } from '#/server/functions/chapters.functions'
import type { Chapter, LessonVideo } from '#/types'

type ChapterEditorProps = {
  chapter?: Chapter
  lessons?: LessonVideo[]
  focusTitle?: boolean
  handleRef: (element: Element | null) => void
  onClose: () => void
}

export default function ChapterEditor({
  chapter,
  lessons = [],
  focusTitle,
  handleRef,
  onClose,
}: ChapterEditorProps) {
  const router = useRouter()
  const [autoSaveError, setAutoSaveError] = useState('')
  const [newLessonId, setNewLessonId] = useState<number>()
  const savedValues = useRef<ChapterEditorFormValues>({
    title: chapter?.title ?? '',
    description: chapter?.description ?? '',
  })
  const { form, formId } = useChapterEditorForm(chapter)

  async function handleAutoSave(value: ChapterEditorFormValues): Promise<void> {
    if (!chapter) {
      return
    }

    if (
      value.title === savedValues.current.title &&
      value.description === savedValues.current.description
    ) {
      return
    }

    setAutoSaveError('')
    let updated: Chapter
    try {
      updated = await updateChapter({ data: { id: chapter.id, ...value } })
    } catch (error) {
      console.error(error)
      setAutoSaveError(error instanceof Error ? error.message : 'Failed to save the chapter')

      return
    }

    savedValues.current = { title: updated.title, description: updated.description }
    await router.invalidate()
  }

  return (
    <Stack gap="5" layerStyle="chapterPanel">
      <Flex align="flex-start" gap="4">
        <DragHandle ref={handleRef} label={`Reorder ${chapter?.title ?? 'chapter'}`} />
        <Box flex="1" minW="0">
          <ChapterEditorForm
            form={form}
            formId={formId}
            autoSaveError={autoSaveError}
            focusTitle={focusTitle}
            onAutoSave={handleAutoSave}
          />
        </Box>
        <CloseButton
          size="sm"
          variant="quiet"
          aria-label="Close chapter editor"
          onClick={onClose}
        />
      </Flex>
      <Stack gap="2">
        <Text textStyle="sectionLabel">Lesson Videos</Text>
        <LessonList chapterId={chapter?.id ?? null} lessons={lessons} newLessonId={newLessonId} />
        {chapter && (
          <Flex align="center" justify="center" gap="4" wrap="wrap" w="full" maxW="32rem" mx="auto">
            <AddLessonButton
              courseId={chapter.courseId}
              chapterId={chapter.id}
              onAdded={(l) => setNewLessonId(l.id)}
            />
            <Box flex="1" minW="16rem">
              <VideoUpload
                courseId={chapter.courseId}
                chapterId={chapter.id}
                onAdded={(l) => setNewLessonId(l.id)}
              />
            </Box>
          </Flex>
        )}
      </Stack>
    </Stack>
  )
}
