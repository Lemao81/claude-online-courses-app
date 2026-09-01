import { Box, Flex, Heading, Link } from '@chakra-ui/react'
import { Link as RouterLink } from '@tanstack/react-router'

export default function Navbar() {
  return (
    <Flex as="nav" flex="1" wrap="wrap" align="center" columnGap="3" rowGap="2">
      <Heading
        as="h2"
        m="0"
        flexShrink="0"
        fontSize="md"
        fontWeight="semibold"
        letterSpacing="tight"
      >
        <Link
          asChild
          display="inline-flex"
          alignItems="center"
          gap="2"
          rounded="full"
          borderWidth="1px"
          borderColor="border.chip"
          bg="bg.chip"
          px={{ base: '3', sm: '4' }}
          py={{ base: '1.5', sm: '2' }}
          fontSize="sm"
          color="fg"
          textDecoration="none"
          boxShadow="chip"
        >
          <RouterLink to="/">
            <Box as="span" boxSize="2" rounded="full" bg="accent" />
            TanStack Start
          </RouterLink>
        </Link>
      </Heading>

      <Flex
        order={{ base: 3, sm: 0 }}
        w={{ base: 'full', sm: 'auto' }}
        wrap={{ base: 'wrap', sm: 'nowrap' }}
        align="center"
        columnGap="4"
        rowGap="1"
        pb={{ base: '1', sm: '0' }}
        fontSize="sm"
        fontWeight="semibold"
      >
        <RouterLink to="/" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>
          Home
        </RouterLink>
        <RouterLink
          to="/about"
          className="nav-link"
          activeProps={{ className: 'nav-link is-active' }}
        >
          About
        </RouterLink>
      </Flex>
    </Flex>
  )
}
