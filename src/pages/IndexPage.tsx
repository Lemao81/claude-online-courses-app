import { Show } from '@clerk/tanstack-react-start'
import LandingPage from '#/pages/LandingPage'
import OverviewPage from '#/pages/OverviewPage'

export default function IndexPage(): React.JSX.Element {
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
