import { createFileRoute } from '@tanstack/react-router'
import CoursesPage from '#/pages/CoursesPage'

export const Route = createFileRoute('/courses')({
  component: CoursesPage,
})
