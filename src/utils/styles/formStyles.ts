import type { SystemStyleObject } from '@chakra-ui/react'

export const dialogBackdropStyles: SystemStyleObject = {
  bg: 'color-mix(in oklab, token(colors.bg) 72%, transparent)',
  backdropFilter: 'blur(3px)',
}

export const dialogContentStyles: SystemStyleObject = {
  rounded: 'panel',
  borderWidth: '1px',
  borderColor: 'border',
  bgColor: 'bg',
  bgGradient: 'panel',
  color: 'fg',
  boxShadow: 'card',
}

export const dialogTitleStyles: SystemStyleObject = {
  fontSize: 'md',
  fontWeight: 'bold',
  color: 'fg',
}

export const fieldLabelStyles: SystemStyleObject = {
  mb: '2',
  fontSize: 'sm',
  fontWeight: 'semibold',
  color: 'fg',
}

export const fieldRequiredIndicatorStyles: SystemStyleObject = {
  color: 'fg.accent',
}

export const fieldControlStyles: SystemStyleObject = {
  h: 'auto',
  minH: '0',
  w: 'full',
  rounded: 'field',
  borderWidth: '1px',
  borderColor: 'border',
  bg: 'color-mix(in oklab, token(colors.bg.panel) 88%, white 12%)',
  color: 'fg',
  px: '0.9rem',
  py: '0.7rem',
  outline: 'none',
  transition: 'border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease',
  _placeholder: { color: 'fg.muted' },
  _focusVisible: {
    borderColor: 'color-mix(in oklab, token(colors.accent.emphasized) 58%, token(colors.border))',
    boxShadow: 'focusRing',
  },
}

export const formErrorStyles: SystemStyleObject = {
  m: '0',
  fontSize: 'sm',
  color: 'fg.error',
}

export const textareaControlStyles: SystemStyleObject = {
  ...fieldControlStyles,
  minH: '7rem',
  py: '0.8rem',
  resize: 'vertical',
}
