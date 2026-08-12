import { Box } from '@chakra-ui/react'
import Navbar from '#/components/layout/Navbar'

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
      <Navbar />
    </Box>
  )
}
