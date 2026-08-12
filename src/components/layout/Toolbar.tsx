import { Flex } from '@chakra-ui/react'
import AuthButtons from '#/components/layout/AuthButtons'
import ColorModeButton from '#/components/ui/ColorModeButton'

export default function Toolbar() {
  return (
    <Flex ml="auto" align="center" gap={{ base: '3', sm: '4' }}>
      <AuthButtons />

      <ColorModeButton />
    </Flex>
  )
}
