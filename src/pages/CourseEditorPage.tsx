import { Heading, Stack } from '@chakra-ui/react'
import { getRouteApi } from '@tanstack/react-router'
import ChapterList from '#/components/chapters/ChapterList'
import CourseEditorTitleBar from '#/components/courses/CourseEditorTitleBar'
import CourseLessonsSection from '#/components/courses/CourseLessonsSection'
import OutlineDragDrop from '#/components/courses/OutlineDragDrop'
import { useSyncedState } from '#/hooks/useSyncedState'

const routeApi = getRouteApi('/editcourse/$courseId')

export default function CourseEditorPage() {
  const course = routeApi.useLoaderData()
  const [outline, setOutline] = useSyncedState(course)

  return (
    <Stack gap="8" px="4" py="6" data-course-id={course.id}>
      <CourseEditorTitleBar title={course.title} />
      <OutlineDragDrop outline={outline} onOutlineChange={setOutline}>
        <CourseLessonsSection courseId={course.id} lessons={outline.lessons} />
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
