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
      borderColor="border"
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
        color="fg.muted"
      >
        Menu
      </Heading>
      <Flex as="nav" direction="column" gap="1">
        <RouterLink
          to="/overview"
          className="nav-link"
          activeProps={{ className: 'nav-link is-active' }}
        >
          Overview
        </RouterLink>
        <RouterLink
          to="/courses"
          className="nav-link"
          activeProps={{ className: 'nav-link is-active' }}
        >
          Courses
        </RouterLink>
        <Flex direction="column" gap="1" pl="4">
          <RouterLink
            to="/mycourses"
            className="nav-link nav-sublink"
            activeProps={{ className: 'nav-link nav-sublink is-active' }}
          >
            My Courses
          </RouterLink>
        </Flex>
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
