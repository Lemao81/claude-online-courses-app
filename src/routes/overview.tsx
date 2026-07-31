import { createFileRoute } from '@tanstack/react-router'
import OverviewPage from '#/components/pages/OverviewPage'
import { requireSignedIn } from '#/server/functions/auth.functions'

export const Route = createFileRoute('/overview')({
  beforeLoad: async () => await requireSignedIn(),
  component: OverviewPage,
})
