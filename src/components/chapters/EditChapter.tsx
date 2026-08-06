import { Box, CloseButton, Flex, Stack, Text } from '@chakra-ui/react'
import { useRouter } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import ChapterLessonList from '#/components/chapters/ChapterLessonList'
import EditChapterForm, {
  type EditChapterFormValues,
  useEditChapterForm,
} from '#/components/chapters/EditChapterForm'
import VideoUpload from '#/components/videos/VideoUpload'
import { updateChapter } from '#/server/functions/chapters.functions'
import { subtleIconButtonStyles } from '#/utils/styles/buttonStyles'
import { chapterPanelStyles, chapterSectionLabelStyles } from '#/utils/styles/chapterStyles'
import type { Chapter, ChapterLessonVideo } from '#/utils/types'

type EditChapterProps = {
  chapter?: Chapter
  lessons?: ChapterLessonVideo[]
  onClose: () => void
}

export default function EditChapter({ chapter, lessons = [], onClose }: EditChapterProps) {
  const router = useRouter()
  const [autoSaveError, setAutoSaveError] = useState('')
  const savedValues = useRef<EditChapterFormValues>({
    title: chapter?.title ?? '',
    description: chapter?.description ?? '',
  })
  const { form, formId } = useEditChapterForm(chapter)

  async function handleAutoSave(value: EditChapterFormValues): Promise<void> {
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
      setAutoSaveError(error instanceof Error ? error.message : 'Failed to save the chapter')

      return
    }

    savedValues.current = { title: updated.title, description: updated.description }
    await router.invalidate()
  }

  return (
    <Stack gap="5" css={chapterPanelStyles}>
      <Flex align="flex-start" gap="4">
        <Box flex="1" minW="0">
          <EditChapterForm
            form={form}
            formId={formId}
            autoSaveError={autoSaveError}
            onAutoSave={handleAutoSave}
          />
        </Box>
        <CloseButton
          size="sm"
          variant="plain"
          aria-label="Close chapter editor"
          css={subtleIconButtonStyles}
          onClick={onClose}
        />
      </Flex>
      <Stack gap="2">
        <Text css={chapterSectionLabelStyles}>Lesson Videos</Text>
        <ChapterLessonList lessons={lessons} />
      </Stack>
      <VideoUpload />
    </Stack>
  )
}
