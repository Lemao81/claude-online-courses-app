import { createFileRoute } from '@tanstack/react-router'
import AppPage from '#/components/pages/AppPage'

export const Route = createFileRoute('/')({
  component: AppPage,
})
