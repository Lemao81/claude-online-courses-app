import { Button, Flex, Stack, Text } from '@chakra-ui/react'
import ChapterLessonList from '#/components/chapters/ChapterLessonList'
import EditChapterForm, { useEditChapterForm } from '#/components/chapters/EditChapterForm'
import VideoUpload from '#/components/videos/VideoUpload'
import { primaryButtonStyles } from '#/utils/styles/buttonStyles'
import { chapterPanelStyles, chapterSectionLabelStyles } from '#/utils/styles/chapterStyles'
import type { Chapter, ChapterLessonVideo } from '#/utils/types'

type EditChapterProps = {
  chapter?: Chapter
  lessons?: ChapterLessonVideo[]
}

export default function EditChapter({ chapter, lessons = [] }: EditChapterProps) {
  const { form, formId } = useEditChapterForm(chapter, handleSubmit)

  async function handleSubmit(): Promise<void> {
    return
  }

  return (
    <Stack gap="5" css={chapterPanelStyles}>
      <EditChapterForm form={form} formId={formId} />
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
