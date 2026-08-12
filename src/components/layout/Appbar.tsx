import { Box, Flex } from '@chakra-ui/react'
import Navbar from '#/components/layout/Navbar'
import Toolbar from '#/components/layout/Toolbar'

export default function Appbar() {
  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="50"
      borderBottomWidth="1px"
      borderColor="border"
      bg="bg.header"
      px="4"
      backdropFilter="blur(16px)"
    >
      <Flex
        className="layout-container"
        wrap="wrap"
        align={{ base: 'flex-start', sm: 'center' }}
        columnGap="3"
        rowGap="2"
        py={{ base: '3', sm: '4' }}
      >
        <Navbar />
        <Toolbar />
      </Flex>
    </Box>
  )
}
