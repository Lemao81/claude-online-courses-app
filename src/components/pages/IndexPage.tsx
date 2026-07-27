import { Show } from '@clerk/tanstack-react-start'
import LandingPage from '#/components/pages/LandingPage'
import OverviewPage from '#/components/pages/OverviewPage'

export default function IndexPage() {
  return (
    <>
      <Show when="signed-out">
        <LandingPage />
      </Show>
      <Show when="signed-in">
        <OverviewPage />
      </Show>
    </>
  )
}
