import { defineSlotRecipe } from '@chakra-ui/react'

export const editableSlotRecipe = defineSlotRecipe({
  slots: [
    'root',
    'area',
    'label',
    'preview',
    'input',
    'editTrigger',
    'submitTrigger',
    'cancelTrigger',
    'control',
    'textarea',
  ],
  base: {
    root: {
      display: 'flex',
      gap: '2',
    },
    preview: {
      flex: '1',
      minW: '0',
      rounded: 'field',
      borderWidth: '1px',
      borderColor: 'transparent',
      px: '0.6rem',
      py: '0.35rem',
      fontSize: 'sm',
      color: 'fg',
      transition: 'background-color 180ms ease, border-color 180ms ease',
      _hover: { bg: 'bg.panel' },
    },
    input: {
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
      focusVisibleRing: 'none',
      transition: 'border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease',
      _placeholder: { color: 'fg.muted' },
      _focusVisible: {
        borderColor: 'border.focus',
        boxShadow: 'focusRing',
      },
    },
    control: {
      display: 'flex',
      gap: '1',
    },
  },
})
