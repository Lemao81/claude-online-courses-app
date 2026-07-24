import { Box, Flex, Heading } from '@chakra-ui/react'
import { Link as RouterLink } from '@tanstack/react-router'

export default function Sidebar() {
  return (
    <Box
      as="aside"
      flexShrink="0"
      w={{ base: 'full', md: '60' }}
      borderRightWidth={{ md: '1px' }}
      borderBottomWidth={{ base: '1px', md: '0' }}
      borderColor="var(--line)"
      px="4"
      py="6"
    >
      <Heading
        as="h2"
        m="0"
        mb="3"
        fontSize="xs"
        fontWeight="semibold"
        letterSpacing="wider"
        textTransform="uppercase"
        color="var(--sea-ink-soft)"
      >
        Menu
      </Heading>
      <Flex as="nav" direction="column" gap="1">
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
    </Box>
  )
}
