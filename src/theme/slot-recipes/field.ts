import { defineSlotRecipe } from '@chakra-ui/react'

export const fieldSlotRecipe = defineSlotRecipe({
  slots: [
    'root',
    'errorText',
    'helperText',
    'input',
    'label',
    'select',
    'textarea',
    'requiredIndicator',
  ],
  base: {
    label: {
      mb: '2',
      fontWeight: 'semibold',
      color: 'fg',
    },
    requiredIndicator: {
      color: 'accent.fg',
    },
  },
})
