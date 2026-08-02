'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import ColorModeProvider from '#/providers/ColorModeProvider'

export default function AppChakraProvider({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider>{children}</ColorModeProvider>
    </ChakraProvider>
  )
}
