import { Heading } from '@chakra-ui/react'
import { useUser } from '@clerk/tanstack-react-start'

export default function Greeting() {
  const { isLoaded, user } = useUser()

  if (!isLoaded) {
    return null
  }

  const salutation = user?.firstName ? `Welcome back, ${user.firstName}!` : 'Welcome back!'

  return (
    <Heading as="h1" m="0" fontSize="xl" color="fg">
      {salutation} Good time for some online training!
    </Heading>
  )
}
