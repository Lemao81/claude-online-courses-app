import { Box, Flex } from '@chakra-ui/react'
import { appbarHeightVariable } from '@/constants'
import { useHeightVariable } from '@/hooks/use-height-variable'
import Navbar from '@/layouts/Navbar'
import Toolbar from '@/layouts/Toolbar'

export default function Appbar(): React.JSX.Element {
  const ref = useHeightVariable<HTMLDivElement>(appbarHeightVariable)

  return (
    <Box
      ref={ref}
      as="header"
      position="sticky"
      top="0"
      zIndex="50"
      borderBottomWidth="1px"
      borderColor="border"
      bg="bg.subtle"
      px="4"
      backdropFilter="blur(16px)"
    >
      <Flex
        layerStyle="container"
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
