import type { SystemStyleObject } from '@chakra-ui/react'

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

export const dropZoneTitleStyles: SystemStyleObject = {
  m: '0',
  fontSize: '1rem',
  fontWeight: 'bold',
  color: 'var(--sea-ink)',
}

export const dropZoneHintStyles: SystemStyleObject = {
  m: '0',
  fontSize: 'sm',
  color: 'var(--sea-ink-soft)',
}

export const fileRowStyles: SystemStyleObject = {
  rounded: '0.85rem',
  borderWidth: '1px',
  borderColor: 'var(--line)',
  bg: 'color-mix(in oklab, var(--surface-strong) 74%, transparent)',
  px: '0.9rem',
  py: '0.65rem',
}

export const fileNameStyles: SystemStyleObject = {
  m: '0',
  fontSize: 'sm',
  fontWeight: 'semibold',
  color: 'var(--sea-ink)',
  wordBreak: 'break-all',
}

export const fileSizeStyles: SystemStyleObject = {
  m: '0',
  fontSize: 'xs',
  color: 'var(--sea-ink-soft)',
}

export const fileRemoveButtonStyles: SystemStyleObject = {
  color: 'var(--sea-ink-soft)',
  _hover: { bg: 'var(--link-bg-hover)', color: 'var(--sea-ink)' },
}
