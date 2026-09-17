import { createFileRoute } from '@tanstack/react-router'
import EditCoursePage from '#/pages/EditCoursePage'
import { requireSignedIn } from '#/server/functions/auth.functions'
import { getAuthoredCourseOutline } from '#/server/functions/courses.functions'

export const Route = createFileRoute('/editcourse/$courseId')({
  beforeLoad: () => requireSignedIn(),
  loader: ({ params }) => getAuthoredCourseOutline({ data: Number(params.courseId) }),
  component: EditCoursePage,
})
