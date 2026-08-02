'use client'

import type { IconButtonProps } from '@chakra-ui/react'
import { ClientOnly, IconButton, Skeleton } from '@chakra-ui/react'
import type { Ref } from 'react'
import type { IconType } from 'react-icons'
import { LuMonitor, LuMoon, LuSun } from 'react-icons/lu'
import { useColorMode } from '#/hooks/useColorMode'
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

type ColorModeButtonProps = IconButtonProps & {
  ref?: Ref<HTMLButtonElement>
}

export default function ColorModeButton({ ref, ...props }: ColorModeButtonProps) {
  const { colorModePreference, setColorMode } = useColorMode()
  const ModeIcon = modeIcons[colorModePreference]

  function toggleColorMode(): void {
    setColorMode(nextModes[colorModePreference])
  }

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
        <ModeIcon />
      </IconButton>
    </ClientOnly>
  )
}
