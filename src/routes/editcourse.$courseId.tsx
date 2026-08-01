import { createFileRoute } from '@tanstack/react-router'
import EditCoursePage from '#/components/pages/EditCoursePage'
import { requireSignedIn } from '#/server/functions/auth.functions'
import { getCourse } from '#/server/functions/courses.functions'

export const Route = createFileRoute('/editcourse/$courseId')({
  beforeLoad: async () => await requireSignedIn(),
  loader: async ({ params }) => await getCourse({ data: Number(params.courseId) }),
  component: EditCoursePage,
})
