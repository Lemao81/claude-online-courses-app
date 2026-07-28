import { Button } from '@chakra-ui/react'
import { Show, SignInButton, UserButton } from '@clerk/tanstack-react-start'
import { chipButtonStyles } from '#/utils/styles/buttonStyles'

export default function ClerkHeader() {
  return (
    <>
      <Show when="signed-in">
        <UserButton />
      </Show>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <Button type="button" variant="plain" css={chipButtonStyles}>
            Sign in
          </Button>
        </SignInButton>
      </Show>
    </>
  )
}
