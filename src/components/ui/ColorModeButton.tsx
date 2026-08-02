'use client'

import { ClientOnly, IconButton, Skeleton } from '@chakra-ui/react'
import type { IconType } from 'react-icons'
import { LuMonitor, LuMoon, LuSun } from 'react-icons/lu'
import { useColorMode } from '#/hooks/useColorMode'
import { roundChipButtonStyles } from '#/utils/styles/buttonStyles'
import type { ColorModePreference } from '#/utils/types'

const modeIcons: Record<ColorModePreference, IconType> = {
  light: LuSun,
  dark: LuMoon,
  system: LuMonitor,
}

const nextModes: Record<ColorModePreference, ColorModePreference> = {
  light: 'dark',
  dark: 'system',
  system: 'light',
}

export default function ColorModeButton() {
  const { colorModePreference, setColorMode } = useColorMode()
  const ModeIcon = modeIcons[colorModePreference]

  function toggleColorMode(): void {
    setColorMode(nextModes[colorModePreference])
  }

  return (
    <ClientOnly fallback={<Skeleton boxSize="9" />}>
      <IconButton
        type="button"
        onClick={toggleColorMode}
        variant="plain"
        aria-label="Toggle color mode"
        size="sm"
        css={roundChipButtonStyles}
      >
        <ModeIcon />
      </IconButton>
    </ClientOnly>
  )
}
