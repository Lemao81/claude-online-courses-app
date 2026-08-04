import type { SystemStyleObject } from '@chakra-ui/react'
import { itemTitleStyles } from '#/utils/styles/textStyles'

export const dropZoneStyles: SystemStyleObject = {
  position: 'relative',
  rounded: '1.25rem',
  borderWidth: '2px',
  borderStyle: 'dashed',
  borderColor: 'var(--line)',
  bg: 'color-mix(in oklab, var(--surface) 82%, transparent)',
  px: '1.5rem',
  py: '2.25rem',
  transition: 'border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease',
}

export const dropZoneActiveStyles: SystemStyleObject = {
  borderColor: 'color-mix(in oklab, var(--lagoon-deep) 62%, var(--line))',
  bg: 'color-mix(in oklab, var(--lagoon) 14%, var(--surface-strong))',
  boxShadow: '0 0 0 4px color-mix(in oklab, var(--lagoon) 18%, transparent)',
}

export const dropZoneIconStyles: SystemStyleObject = {
  display: 'grid',
  placeItems: 'center',
  w: '3rem',
  h: '3rem',
  rounded: 'full',
  borderWidth: '1px',
  borderColor: 'var(--chip-line)',
  bg: 'var(--chip-bg)',
  color: 'var(--lagoon-deep)',
}

export const fileNameStyles: SystemStyleObject = {
  ...itemTitleStyles,
  wordBreak: 'break-all',
}
