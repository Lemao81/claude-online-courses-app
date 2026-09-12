import { Button } from '@chakra-ui/react'
import { Show, SignInButton, UserButton } from '@clerk/tanstack-react-start'

export default function AuthButtons() {
  return (
    <>
      <Show when="signed-in">
        <UserButton />
      </Show>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <Button type="button" variant="chip">
            Sign in
          </Button>
        </SignInButton>
      </Show>
    </>
  )
}
