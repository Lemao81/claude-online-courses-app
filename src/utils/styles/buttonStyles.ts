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
