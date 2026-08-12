import { Flex } from '@chakra-ui/react'
import ColorModeButton from '#/components/ui/ColorModeButton'
import AuthButtons from '#/layouts/AuthButtons'

export default function Toolbar() {
  return (
    <Flex align="center" gap={{ base: '3', sm: '4' }}>
      <AuthButtons />

      <ColorModeButton />
    </Flex>
  )
}
