import { Box, Flex } from '@chakra-ui/react'
import { Show } from '@clerk/tanstack-react-start'
import Appbar from '#/layouts/Appbar'
import Footer from '#/layouts/Footer'
import Sidebar from '#/layouts/Sidebar'

type MainLayoutProps = {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <Flex direction="column" minH="100dvh">
      <Appbar />
      <Flex
        className="layout-container"
        direction={{ base: 'column', md: 'row' }}
        align="stretch"
        flex="1"
        minH="0"
      >
        <Show when="signed-in">
          <Sidebar />
        </Show>
        <Flex as="main" direction="column" flex="1" minW="0">
          <Box flex="1">{children}</Box>
          <Footer />
        </Flex>
      </Flex>
    </Flex>
  )
}
