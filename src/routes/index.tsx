import { createFileRoute } from '@tanstack/react-router'
import AppPage from '../components/page/AppPage'

export const Route = createFileRoute('/')({
  component: AppPage,
})
