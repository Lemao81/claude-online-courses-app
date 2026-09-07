import type { SystemStyleObject } from '@chakra-ui/react'

export const dialogBackdropStyles: SystemStyleObject = {
  bg: 'bg',
  backdropFilter: 'blur(3px)',
}

export const dialogContentStyles: SystemStyleObject = {
  rounded: 'panel',
  borderWidth: '1px',
  borderColor: 'border',
  bgColor: 'bg',
  bg: 'bg.panel',
  color: 'fg',
  boxShadow: 'card',
}

export const dialogTitleStyles: SystemStyleObject = {
  fontSize: 'md',
  fontWeight: 'bold',
  color: 'fg',
}

export const dialogQuestionStyles: SystemStyleObject = {
  m: '0',
  fontSize: 'sm',
  color: 'fg',
}

export const fieldLabelStyles: SystemStyleObject = {
  mb: '2',
  fontSize: 'sm',
  fontWeight: 'semibold',
  color: 'fg',
}

export const fieldRequiredIndicatorStyles: SystemStyleObject = {
  color: 'fg.emphasized',
}

export const fieldControlStyles: SystemStyleObject = {
  h: 'auto',
  minH: '0',
  w: 'full',
  rounded: 'field',
  borderWidth: '1px',
  borderColor: 'border',
  bg: 'bg.panel',
  color: 'fg',
  px: '0.9rem',
  py: '0.7rem',
  outline: 'none',
  transition: 'border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease',
  _placeholder: { color: 'fg.muted' },
  _focusVisible: {
    borderColor: 'color-mix(in oklab, token(colors.fg.emphasized) 58%, token(colors.border))',
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
