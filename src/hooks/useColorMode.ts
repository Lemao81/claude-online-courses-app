'use client'

import { useTheme } from 'next-themes'
import type { ColorModePreference } from '#/utils/types'

type UseColorModeReturn = {
  colorModePreference: ColorModePreference
  setColorMode: (colorMode: ColorModePreference) => void
}

function toColorModePreference(theme: string | undefined): ColorModePreference {
  return theme === 'light' || theme === 'dark' ? theme : 'system'
}

export function useColorMode(): UseColorModeReturn {
  const { theme, setTheme } = useTheme()

  return {
    colorModePreference: toColorModePreference(theme),
    setColorMode: setTheme,
  }
}
