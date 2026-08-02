'use client'

import type { IconButtonProps, SpanProps } from '@chakra-ui/react'
import { ClientOnly, IconButton, Skeleton, Span } from '@chakra-ui/react'
import type { ThemeProviderProps } from 'next-themes'
import { ThemeProvider, useTheme } from 'next-themes'
import type { Ref } from 'react'
import { LuMonitor, LuMoon, LuSun } from 'react-icons/lu'

export type ColorModeProviderProps = ThemeProviderProps

export function ColorModeProvider(props: ColorModeProviderProps) {
  return <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
}

export type ColorMode = 'light' | 'dark'

export type ColorModePreference = ColorMode | 'system'

export type UseColorModeReturn = {
  colorMode: ColorMode
  colorModePreference: ColorModePreference
  setColorMode: (colorMode: ColorModePreference) => void
  toggleColorMode: () => void
}

function toColorModePreference(theme: string | undefined): ColorModePreference {
  return theme === 'light' || theme === 'dark' ? theme : 'system'
}

export function useColorMode(): UseColorModeReturn {
  const { theme, resolvedTheme, setTheme, forcedTheme } = useTheme()
  const colorMode = forcedTheme || resolvedTheme
  const toggleColorMode = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')

  return {
    colorMode: colorMode as ColorMode,
    colorModePreference: toColorModePreference(theme),
    setColorMode: setTheme,
    toggleColorMode,
  }
}

export function useColorModeValue<T>(light: T, dark: T): T {
  const { colorMode } = useColorMode()

  return colorMode === 'dark' ? dark : light
}

export function ColorModeIcon() {
  const { colorMode, colorModePreference } = useColorMode()

  if (colorModePreference === 'system') {
    return <LuMonitor />
  }

  return colorMode === 'dark' ? <LuMoon /> : <LuSun />
}

type ColorModeButtonProps = IconButtonProps & {
  ref?: Ref<HTMLButtonElement>
}

export function ColorModeButton({ ref, ...props }: ColorModeButtonProps) {
  const { toggleColorMode } = useColorMode()

  return (
    <ClientOnly fallback={<Skeleton boxSize="9" />}>
      <IconButton
        onClick={toggleColorMode}
        variant="ghost"
        aria-label="Toggle color mode"
        size="sm"
        ref={ref}
        css={{
          _icon: {
            width: '5',
            height: '5',
          },
        }}
        {...props}
      >
        <ColorModeIcon />
      </IconButton>
    </ClientOnly>
  )
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
