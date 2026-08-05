import type { SystemStyleObject } from '@chakra-ui/react'

export const dialogBackdropStyles: SystemStyleObject = {
  bg: 'color-mix(in oklab, var(--bg-base) 72%, transparent)',
  backdropFilter: 'blur(3px)',
}

export const dialogContentStyles: SystemStyleObject = {
  rounded: 'panel',
  borderWidth: '1px',
  borderColor: 'var(--line)',
  bg: 'linear-gradient(165deg, var(--surface-strong), var(--surface)), var(--bg-base)',
  color: 'var(--sea-ink)',
  boxShadow: 'card',
}

export const dialogTitleStyles: SystemStyleObject = {
  fontSize: '1rem',
  fontWeight: 'bold',
  color: 'var(--sea-ink)',
}

export const fieldLabelStyles: SystemStyleObject = {
  mb: '2',
  fontSize: 'sm',
  fontWeight: 'semibold',
  color: 'var(--sea-ink)',
}

export const fieldRequiredIndicatorStyles: SystemStyleObject = {
  color: 'var(--lagoon-deep)',
}

export const fieldControlStyles: SystemStyleObject = {
  h: 'auto',
  minH: '0',
  w: 'full',
  rounded: '0.75rem',
  borderWidth: '1px',
  borderColor: 'var(--line)',
  bg: 'color-mix(in oklab, var(--surface-strong) 88%, white 12%)',
  color: 'var(--sea-ink)',
  px: '0.9rem',
  py: '0.7rem',
  outline: 'none',
  transition: 'border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease',
  _placeholder: { color: 'var(--sea-ink-soft)' },
  _focusVisible: {
    borderColor: 'color-mix(in oklab, var(--lagoon-deep) 58%, var(--line))',
    boxShadow: '0 0 0 3px color-mix(in oklab, var(--lagoon) 24%, transparent)',
  },
}

export const formErrorStyles: SystemStyleObject = {
  m: '0',
  fontSize: 'sm',
  color: 'var(--danger)',
}

export const textareaControlStyles: SystemStyleObject = {
  ...fieldControlStyles,
  minH: '7rem',
  py: '0.8rem',
  resize: 'vertical',
}
