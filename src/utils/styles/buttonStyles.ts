import type { SystemStyleObject } from '@chakra-ui/react'

export const chipButtonStyles: SystemStyleObject = {
  h: 'auto',
  minH: '0',
  rounded: 'full',
  borderWidth: '1px',
  borderColor: 'var(--chip-line)',
  bg: 'var(--chip-bg)',
  px: '3',
  py: '1.5',
  fontSize: 'sm',
  fontWeight: 'semibold',
  color: 'var(--sea-ink)',
  boxShadow: '0 8px 22px rgba(30,90,72,0.08)',
  transition: 'all 0.15s ease',
  _hover: { transform: 'translateY(-2px)' },
}

export const roundChipButtonStyles: SystemStyleObject = {
  ...chipButtonStyles,
  w: '9',
  h: '9',
  minW: '9',
  px: '0',
  py: '0',
  _icon: { width: '5', height: '5' },
}

export const chipIconButtonStyles: SystemStyleObject = {
  ...chipButtonStyles,
  px: '2',
  py: '2',
  _hover: { transform: 'translateY(-2px)', color: 'var(--sea-ink)' },
}

export const subtleIconButtonStyles: SystemStyleObject = {
  color: 'var(--sea-ink-soft)',
  _hover: { bg: 'var(--link-bg-hover)', color: 'var(--sea-ink)' },
}

export const primaryButtonStyles: SystemStyleObject = {
  h: 'auto',
  minH: '0',
  rounded: '0.85rem',
  borderWidth: '1px',
  borderColor: 'color-mix(in oklab, var(--lagoon-deep) 34%, var(--line))',
  bg: 'color-mix(in oklab, var(--lagoon) 22%, var(--surface-strong))',
  px: '1rem',
  py: '0.72rem',
  fontSize: '0.9rem',
  fontWeight: 'bold',
  lineHeight: '1',
  color: 'var(--sea-ink)',
  transition: 'all 0.15s ease',
  _hover: {
    transform: 'translateY(-1px)',
    bg: 'color-mix(in oklab, var(--lagoon) 30%, var(--surface-strong))',
  },
  _disabled: { cursor: 'not-allowed', opacity: '0.55', transform: 'none' },
}

export const secondaryButtonStyles: SystemStyleObject = {
  ...primaryButtonStyles,
  borderColor: 'var(--line)',
  bg: 'color-mix(in oklab, var(--surface-strong) 74%, transparent)',
  color: 'var(--sea-ink-soft)',
  _hover: {
    transform: 'translateY(-1px)',
    bg: 'color-mix(in oklab, var(--surface-strong) 88%, transparent)',
  },
}
