import { defineSlotRecipe } from '@chakra-ui/react'

export const toastSlotRecipe = defineSlotRecipe({
  slots: ['root', 'title', 'description', 'indicator', 'closeTrigger', 'actionTrigger'],
  base: {
    root: {
      '&[data-type=success]': {
        bg: 'success.solid',
        color: 'success.contrast',
        '--toast-trigger-bg': '{currentColor/10}',
        '--toast-border-color': '{currentColor/40}',
      },
      '&[data-type=error]': {
        bg: 'danger.solid',
        color: 'danger.contrast',
        '--toast-trigger-bg': '{currentColor/10}',
        '--toast-border-color': '{currentColor/40}',
      },
    },
  },
})
