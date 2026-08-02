import { useEffect } from 'react'
import ColorModeButton from '#/components/ui/ColorModeButton'
import { useColorMode } from '#/hooks/useColorMode'
import type { ColorModePreference } from '#/utils/types'

function applyThemeMode(mode: ColorModePreference): void {
  if (mode === 'system') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', mode)
  }
}

export default function ThemeToggle() {
  const { colorModePreference: mode } = useColorMode()

  useEffect(() => {
    applyThemeMode(mode)
  }, [mode])

  return <ColorModeButton />
}
