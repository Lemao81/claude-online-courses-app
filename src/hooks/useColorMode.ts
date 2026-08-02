'use client'

import { useTheme } from 'next-themes'
import type { ColorMode, ColorModePreference } from '#/utils/types'

type UseColorModeReturn = {
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
