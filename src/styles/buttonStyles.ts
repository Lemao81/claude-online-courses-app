import type { SystemStyleObject } from '@chakra-ui/react'

export const chipButtonStyles: SystemStyleObject = {
  h: 'auto',
  minH: '0',
  rounded: 'full',
  borderWidth: '1px',
  borderColor: 'border.chip',
  bg: 'bg.chip',
  px: '3',
  py: '1.5',
  fontSize: 'sm',
  fontWeight: 'semibold',
  color: 'fg',
  boxShadow: 'chip',
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
  _hover: { transform: 'translateY(-2px)', color: 'fg' },
}

export const subtleIconButtonStyles: SystemStyleObject = {
  color: 'fg.muted',
  _hover: { bg: 'bg.hover', color: 'fg' },
}

export const primaryButtonStyles: SystemStyleObject = {
  h: 'auto',
  minH: '0',
  rounded: 'control',
  borderWidth: '1px',
  borderColor: 'color-mix(in oklab, token(colors.accent.emphasized) 34%, token(colors.border))',
  bg: 'color-mix(in oklab, token(colors.accent) 22%, token(colors.bg.panel))',
  px: '1rem',
  py: '0.72rem',
  fontSize: '0.9rem',
  fontWeight: 'bold',
  lineHeight: '1',
  color: 'fg',
  transition: 'all 0.15s ease',
  _hover: {
    transform: 'translateY(-1px)',
    bg: 'color-mix(in oklab, token(colors.accent) 30%, token(colors.bg.panel))',
  },
  _disabled: { cursor: 'not-allowed', opacity: '0.55', transform: 'none' },
}

export const secondaryButtonStyles: SystemStyleObject = {
  ...primaryButtonStyles,
  borderColor: 'border',
  bg: 'bg.wash',
  color: 'fg.muted',
  _hover: {
    transform: 'translateY(-1px)',
    bg: 'bg.washHover',
  },
}
