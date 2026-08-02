'use client'

import type { SpanProps } from '@chakra-ui/react'
import { Span } from '@chakra-ui/react'
import type { Ref } from 'react'
import { useColorMode } from '#/hooks/useColorMode'

export function useColorModeValue<T>(light: T, dark: T): T {
  const { colorMode } = useColorMode()

  return colorMode === 'dark' ? dark : light
}

type ColorModeSpanProps = SpanProps & {
  ref?: Ref<HTMLSpanElement>
}

export function LightMode({ ref, ...props }: ColorModeSpanProps) {
  return (
    <Span
      color="fg"
      display="contents"
      className="chakra-theme light"
      colorPalette="gray"
      colorScheme="light"
      ref={ref}
      {...props}
    />
  )
}

export function DarkMode({ ref, ...props }: ColorModeSpanProps) {
  return (
    <Span
      color="fg"
      display="contents"
      className="chakra-theme dark"
      colorPalette="gray"
      colorScheme="dark"
      ref={ref}
      {...props}
    />
  )
}
