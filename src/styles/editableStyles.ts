import type { SystemStyleObject } from '@chakra-ui/react'

export const editableRootStyles: SystemStyleObject = {
  display: 'flex',
  alignItems: 'center',
  gap: '2',
  w: 'full',
}

export const editablePreviewStyles: SystemStyleObject = {
  flex: '1',
  minW: '0',
  rounded: 'field',
  borderWidth: '1px',
  borderColor: 'transparent',
  px: '0.6rem',
  py: '0.35rem',
  fontSize: 'sm',
  color: 'fg',
  cursor: 'text',
  transition: 'background-color 180ms ease, border-color 180ms ease',
  _hover: { bg: 'bg.panel' },
}

export const editableInputStyles: SystemStyleObject = {
  flex: '1',
  minW: '0',
  rounded: 'field',
  borderWidth: '1px',
  borderColor: 'border',
  bg: 'bg.panel',
  px: '0.6rem',
  py: '0.35rem',
  fontSize: 'sm',
  color: 'fg',
  outline: 'none',
  transition: 'border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease',
  _placeholder: { color: 'fg.muted' },
  _focusVisible: {
    borderColor: 'color-mix(in oklab, token(colors.accent.emphasized) 58%, token(colors.border))',
    boxShadow: 'focusRing',
  },
}

export const editableControlStyles: SystemStyleObject = {
  display: 'flex',
  alignItems: 'center',
  gap: '1',
}
