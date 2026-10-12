import { Stack } from '@chakra-ui/react'
import { getRouteApi } from '@tanstack/react-router'
import CourseChaptersSection from '@/components/courses/CourseChaptersSection'
import CourseEditorTitleBar from '@/components/courses/CourseEditorTitleBar'
import CourseLessonsSection from '@/components/courses/CourseLessonsSection'
import OutlineDragDrop from '@/components/courses/OutlineDragDrop'
import { useSyncedState } from '@/hooks/use-synced-state'

const routeApi = getRouteApi('/editcourse/$courseId')

export default function CourseEditorPage(): React.JSX.Element {
  const course = routeApi.useLoaderData()
  const [outline, setOutline] = useSyncedState(course)

  return (
    <Stack gap="8" px="4" py="6" data-course-id={course.id}>
      <CourseEditorTitleBar title={course.title} />
      <OutlineDragDrop outline={outline} onOutlineChange={setOutline}>
        <CourseLessonsSection courseId={course.id} lessons={outline.lessons} />
        <CourseChaptersSection courseId={course.id} chapters={outline.chapters} />
      </OutlineDragDrop>
    </Stack>
  )
}
