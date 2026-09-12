import { Box, Flex, Heading, Link } from '@chakra-ui/react'
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
        <Link asChild variant="nav">
          <RouterLink to="/overview">Overview</RouterLink>
        </Link>
        <Link asChild variant="nav">
          <RouterLink to="/courses">Courses</RouterLink>
        </Link>
        <Flex direction="column" gap="1" pl="4">
          <Link asChild variant="nav" fontSize="sm">
            <RouterLink to="/mycourses">My Courses</RouterLink>
          </Link>
        </Flex>
        <Link asChild variant="nav">
          <RouterLink to="/about">About</RouterLink>
        </Link>
      </Flex>
    </Box>
  )
}
