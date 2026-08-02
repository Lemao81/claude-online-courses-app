import { useEffect } from 'react'
import ColorModeButton from '#/components/ui/ColorModeButton'
import { useColorMode } from '#/hooks/useColorMode'
import type { ColorModePreference } from '#/utils/types'
import { roundChipButtonStyles } from '#/utils/styles/buttonStyles'

function applyThemeMode(mode: ColorModePreference): void {
  if (mode === 'system') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', mode)
  }
}

export default function ThemeToggle() {
  const { colorModePreference: mode, setColorMode } = useColorMode()

  useEffect(() => {
    applyThemeMode(mode)
  }, [mode])

  function toggleMode(): void {
    setColorMode(mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light')
  }

  const label =
    mode === 'system'
      ? 'Theme mode: system (auto). Click to switch to light mode.'
      : `Theme mode: ${mode}. Click to switch mode.`

  return (
    <ColorModeButton
      type="button"
      onClick={toggleMode}
      aria-label={label}
      title={label}
      variant="plain"
      css={roundChipButtonStyles}
    />
  )
}
