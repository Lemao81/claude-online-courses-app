import { Box, Flex, Heading, Stack } from '@chakra-ui/react'
import { getRouteApi } from '@tanstack/react-router'
import { useState } from 'react'
import ChapterList from '#/components/chapters/ChapterList'
import CourseEditorTitleBar from '#/components/courses/CourseEditorTitleBar'
import OutlineDragDrop from '#/components/courses/OutlineDragDrop'
import AddLessonButton from '#/components/lessons/AddLessonButton'
import LessonList from '#/components/lessons/LessonList'
import VideoUpload from '#/components/videos/VideoUpload'
import { useSyncedState } from '#/hooks/useSyncedState'

const routeApi = getRouteApi('/editcourse/$courseId')

export default function CourseEditorPage() {
  const course = routeApi.useLoaderData()
  const [outline, setOutline] = useSyncedState(course)
  const [newLessonId, setNewLessonId] = useState<number>()

  return (
    <Stack gap="8" px="4" py="6" data-course-id={course.id}>
      <CourseEditorTitleBar title={course.title} />
      <OutlineDragDrop outline={outline} onOutlineChange={setOutline}>
        <Stack as="section" gap="3">
          <Heading as="h2" m="0" textStyle="sectionHeading">
            Lessons
          </Heading>
          <LessonList chapterId={null} lessons={outline.lessons} newLessonId={newLessonId} />
          <Flex align="center" justify="center" gap="4" wrap="wrap" w="full" maxW="32rem" mx="auto">
            <AddLessonButton courseId={course.id} onAdded={(l) => setNewLessonId(l.id)} />
            <Box flex="1" minW="16rem">
              <VideoUpload courseId={course.id} onAdded={(l) => setNewLessonId(l.id)} />
            </Box>
          </Flex>
        </Stack>
        <Stack as="section" gap="3">
          <Heading as="h2" m="0" textStyle="sectionHeading">
            Chapters
          </Heading>
          <ChapterList courseId={course.id} chapters={outline.chapters} />
        </Stack>
      </OutlineDragDrop>
    </Stack>
  )
}
