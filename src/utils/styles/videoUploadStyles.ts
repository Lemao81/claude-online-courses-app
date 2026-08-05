import type { SystemStyleObject } from '@chakra-ui/react'
import { itemTitleStyles } from '#/utils/styles/textStyles'

export const dropZoneStyles: SystemStyleObject = {
  position: 'relative',
  rounded: 'panel',
  borderWidth: '2px',
  borderStyle: 'dashed',
  borderColor: 'border',
  bg: 'color-mix(in oklab, token(colors.bg.subtle) 82%, transparent)',
  px: '1.5rem',
  py: '2.25rem',
  transition: 'border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease',
}

export const dropZoneActiveStyles: SystemStyleObject = {
  borderColor: 'color-mix(in oklab, token(colors.accent.emphasized) 62%, token(colors.border))',
  bg: 'color-mix(in oklab, token(colors.accent) 14%, token(colors.bg.panel))',
  boxShadow: 'dropRing',
}

export const dropZoneIconStyles: SystemStyleObject = {
  display: 'grid',
  placeItems: 'center',
  w: '3rem',
  h: '3rem',
  rounded: 'full',
  borderWidth: '1px',
  borderColor: 'border.chip',
  bg: 'bg.chip',
  color: 'fg.accent',
}

export const fileNameStyles: SystemStyleObject = {
  ...itemTitleStyles,
  wordBreak: 'break-all',
}
