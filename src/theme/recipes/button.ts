import { defineRecipe, type SystemStyleObject } from '@chakra-ui/react'

const chipStyles: SystemStyleObject = {
  h: 'auto',
  minH: '0',
  rounded: 'full',
  borderWidth: '1px',
  borderColor: 'colorPalette.muted',
  bg: 'colorPalette.subtle',
  px: '3',
  py: '1.5',
  fontSize: 'sm',
  fontWeight: 'semibold',
  color: 'colorPalette.fg',
  boxShadow: 'chip',
  transition: 'all 0.15s ease',
  _hover: { transform: 'translateY(-2px)' },
}

const raisedStyles: SystemStyleObject = {
  h: 'auto',
  minH: '0',
  rounded: 'control',
  borderWidth: '1px',
  px: '1rem',
  py: '0.72rem',
  textStyle: 'control',
  fontWeight: 'bold',
  transition: 'all 0.15s ease',
  _hover: { transform: 'translateY(-1px)' },
  _disabled: { cursor: 'not-allowed', opacity: '0.55', transform: 'none' },
}

export const buttonRecipe = defineRecipe({
  base: {
    colorPalette: 'brand',
  },
  variants: {
    variant: {
      primary: {
        ...raisedStyles,
        borderColor: 'colorPalette.border',
        bg: 'colorPalette.muted',
        color: 'colorPalette.fg',
        _hover: { transform: 'translateY(-1px)', bg: 'colorPalette.emphasized' },
      },
      secondary: {
        ...raisedStyles,
        borderColor: 'colorPalette.muted',
        color: 'colorPalette.fg',
        _hover: { transform: 'translateY(-1px)', bg: 'colorPalette.subtle' },
      },
      chip: chipStyles,
      chipRound: {
        ...chipStyles,
        w: '9',
        h: '9',
        minW: '9',
        px: '0',
        py: '0',
        _icon: { width: '5', height: '5' },
      },
      chipIcon: {
        ...chipStyles,
        px: '2',
        py: '2',
      },
      quiet: {
        color: 'colorPalette.fg',
        _hover: { bg: 'colorPalette.subtle' },
      },
    },
  },
})
