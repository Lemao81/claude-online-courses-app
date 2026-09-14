import { Flex, Link } from '@chakra-ui/react'
import { Link as RouterLink } from '@tanstack/react-router'

export default function Navbar() {
  return (
    <Flex
      as="nav"
      flex="1"
      wrap="wrap"
      align="center"
      columnGap="4"
      rowGap="1"
      fontSize="sm"
      fontWeight="semibold"
    >
      <Link asChild variant="nav">
        <RouterLink to="/">Home</RouterLink>
      </Link>
      <Link asChild variant="nav">
        <RouterLink to="/about">About</RouterLink>
      </Link>
    </Flex>
  )
}
