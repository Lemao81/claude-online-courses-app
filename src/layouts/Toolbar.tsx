import { Flex } from '@chakra-ui/react'
import AuthButtons from '#/layouts/AuthButtons'
import ColorModeButton from '#/components/ui/ColorModeButton'

export default function Toolbar() {
  return (
    <Flex align="center" gap={{ base: '3', sm: '4' }}>
      <AuthButtons />

      <ColorModeButton />
    </Flex>
  )
}
