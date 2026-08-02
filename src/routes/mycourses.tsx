import { createFileRoute } from '@tanstack/react-router'
import MyCoursesPage from '#/components/pages/MyCoursesPage'
import { requireSignedIn } from '#/server/functions/auth.functions'
import { getAuthoredCourses } from '#/server/functions/courses.functions'

export const Route = createFileRoute('/mycourses')({
  beforeLoad: () => requireSignedIn(),
  loader: () => getAuthoredCourses(),
  component: MyCoursesPage,
})
