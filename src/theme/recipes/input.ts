import { defineRecipe, type SystemStyleObject } from '@chakra-ui/react'

export const controlStyles: SystemStyleObject = {
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
  transition: 'border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease',
  _placeholder: { color: 'fg.muted' },
  _focusVisible: {
    borderColor: 'border.focus',
    boxShadow: 'focusRing',
  },
}

export const inputRecipe = defineRecipe({
  variants: {
    variant: {
      field: controlStyles,
    },
  },
  defaultVariants: {
    variant: 'field',
  },
})
