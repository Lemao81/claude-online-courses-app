import { Stack } from '@chakra-ui/react'
import { getRouteApi } from '@tanstack/react-router'
import CourseChaptersSection from '@/components/courses/CourseChaptersSection'
import CourseDetailsSection from '@/components/courses/CourseDetailsSection'
import CourseDetailsView from '@/components/courses/CourseDetailsView'
import CourseEditorHeader from '@/components/courses/CourseEditorHeader'
import CourseLessonsSection from '@/components/courses/CourseLessonsSection'
import CourseOutlineView from '@/components/courses/CourseOutlineView'
import CourseReadinessChecklist from '@/components/courses/CourseReadinessChecklist'
import LessonMoveProvider from '@/components/courses/LessonMoveProvider'
import OutlineDragDrop from '@/components/courses/OutlineDragDrop'
import { useSyncedState } from '@/hooks/use-synced-state'

const routeApi = getRouteApi('/editcourse/$courseId')

export default function CourseEditorPage(): React.JSX.Element {
  const course = routeApi.useLoaderData()
  const [outline, setOutline] = useSyncedState(course)

  return (
    <Stack gap="8" px="4" py="6" data-course-id={course.id}>
      <CourseEditorHeader course={outline} />
      {course.status === 'archived' ? (
        <>
          <CourseDetailsView course={course} thumbnailUrl={course.thumbnailUrl} />
          <CourseOutlineView outline={course} />
        </>
      ) : (
        <>
          <CourseDetailsSection course={course} thumbnailUrl={course.thumbnailUrl} />
          <CourseReadinessChecklist course={outline} />
          <LessonMoveProvider outline={outline} onOutlineChange={setOutline}>
            <OutlineDragDrop outline={outline} onOutlineChange={setOutline}>
              <CourseLessonsSection courseId={course.id} lessons={outline.lessons} />
              <CourseChaptersSection courseId={course.id} chapters={outline.chapters} />
            </OutlineDragDrop>
          </LessonMoveProvider>
        </>
      )}
    </Stack>
  )
}
