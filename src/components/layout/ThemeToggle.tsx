import { useEffect } from 'react'
import ColorModeButton from '#/components/ui/ColorModeButton'
import { useColorMode } from '#/hooks/useColorMode'
import { roundChipButtonStyles } from '#/utils/styles/buttonStyles'
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

  const label =
    mode === 'system'
      ? 'Theme mode: system (auto). Click to switch to light mode.'
      : `Theme mode: ${mode}. Click to switch mode.`

  return (
    <ColorModeButton
      type="button"
      aria-label={label}
      title={label}
      variant="plain"
      css={roundChipButtonStyles}
    />
  )
}
