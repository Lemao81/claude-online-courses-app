import { createFileRoute } from '@tanstack/react-router'
import AboutPage from '../components/page/AboutPage'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})
