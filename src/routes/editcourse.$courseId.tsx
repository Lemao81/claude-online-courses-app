import { createFileRoute } from '@tanstack/react-router'
import EditCoursePage from '#/components/pages/EditCoursePage'
import { requireSignedIn } from '#/server/functions/auth.functions'
import { getAuthoredCourse } from '#/server/functions/courses.functions'

export const Route = createFileRoute('/editcourse/$courseId')({
  beforeLoad: async () => await requireSignedIn(),
  loader: async ({ params }) => await getAuthoredCourse({ data: Number(params.courseId) }),
  component: EditCoursePage,
})
