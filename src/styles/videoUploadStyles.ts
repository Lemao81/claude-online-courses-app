import type { SystemStyleObject } from '@chakra-ui/react'

export const dropZoneStyles: SystemStyleObject = {
  position: 'relative',
  rounded: 'panel',
  borderWidth: '2px',
  borderStyle: 'dashed',
  borderColor: 'border',
  bg: 'bg.subtle',
  px: '1.5rem',
  py: '2.25rem',
  transition: 'border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease',
}

export const dropZoneActiveStyles: SystemStyleObject = {
  borderColor: 'color-mix(in oklab, token(colors.fg.emphasized) 62%, token(colors.border))',
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
  borderColor: 'border',
  bg: 'bg.subtle',
  color: 'fg.emphasized',
}

export const fileNameStyles: SystemStyleObject = {
  textStyle: 'itemTitle',
  wordBreak: 'break-all',
}
