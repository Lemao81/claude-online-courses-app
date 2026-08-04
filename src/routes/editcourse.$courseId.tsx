import { createFileRoute } from '@tanstack/react-router'
import EditCoursePage from '#/components/pages/EditCoursePage'
import { requireSignedIn } from '#/server/functions/auth.functions'
import { getAuthoredCourseWithChapters } from '#/server/functions/courses.functions'

export const Route = createFileRoute('/editcourse/$courseId')({
  beforeLoad: () => requireSignedIn(),
  loader: ({ params }) => getAuthoredCourseWithChapters({ data: Number(params.courseId) }),
  component: EditCoursePage,
})
