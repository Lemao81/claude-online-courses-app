import { Box, Button, CloseButton, Flex, Stack, Text } from '@chakra-ui/react'
import ChapterLessonList from '#/components/chapters/ChapterLessonList'
import EditChapterForm, { useEditChapterForm } from '#/components/chapters/EditChapterForm'
import VideoUpload from '#/components/videos/VideoUpload'
import { primaryButtonStyles, subtleIconButtonStyles } from '#/utils/styles/buttonStyles'
import { chapterPanelStyles, chapterSectionLabelStyles } from '#/utils/styles/chapterStyles'
import type { Chapter, ChapterLessonVideo } from '#/utils/types'

type EditChapterProps = {
  chapter?: Chapter
  lessons?: ChapterLessonVideo[]
  onClose: () => void
}

export default function EditChapter({ chapter, lessons = [], onClose }: EditChapterProps) {
  const { form, formId } = useEditChapterForm(chapter, handleSubmit)

  async function handleSubmit(): Promise<void> {
    return
  }

  return (
    <Stack gap="5" css={chapterPanelStyles}>
      <Flex align="flex-start" gap="4">
        <Box flex="1" minW="0">
          <EditChapterForm form={form} formId={formId} />
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
      <Flex justify="flex-end">
        <form.Subscribe
          selector={(state) => ({
            isTitleEmpty: state.values.title.trim().length === 0,
            isSubmitting: state.isSubmitting,
          })}
        >
          {({ isTitleEmpty, isSubmitting }) => (
            <Button
              type="submit"
              form={formId}
              variant="plain"
              disabled={isTitleEmpty || isSubmitting}
              css={primaryButtonStyles}
            >
              {isSubmitting ? 'Saving…' : 'Save'}
            </Button>
          )}
        </form.Subscribe>
      </Flex>
    </Stack>
  )
}
