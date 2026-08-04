import type { SystemStyleObject } from '@chakra-ui/react'

export const rowStyles: SystemStyleObject = {
  rounded: '0.85rem',
  borderWidth: '1px',
  borderColor: 'var(--line)',
  bg: 'color-mix(in oklab, var(--surface-strong) 74%, transparent)',
  px: '0.9rem',
  py: '0.65rem',
}

export const emptyStateStyles: SystemStyleObject = {
  m: '0',
  borderWidth: '1px',
  borderStyle: 'dashed',
  borderColor: 'var(--line)',
  px: '1rem',
  textAlign: 'center',
  fontSize: 'sm',
  color: 'var(--sea-ink-soft)',
}
