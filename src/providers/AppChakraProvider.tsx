'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'
import { system } from '#/theme'

export default function AppChakraProvider({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute={['class', 'data-theme']} disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </ChakraProvider>
  )
}
