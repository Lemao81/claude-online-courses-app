import { defineSlotRecipe } from '@chakra-ui/react'

export const dialogSlotRecipe = defineSlotRecipe({
  slots: [
    'trigger',
    'backdrop',
    'positioner',
    'content',
    'title',
    'description',
    'closeTrigger',
    'header',
    'body',
    'footer',
  ],
  base: {
    backdrop: {
      bg: 'bg',
      backdropFilter: 'blur(3px)',
    },
    content: {
      rounded: 'panel',
      borderWidth: '1px',
      borderColor: 'border',
      bg: 'bg.panel',
      color: 'fg',
      boxShadow: 'card',
    },
    title: {
      fontSize: 'md',
      fontWeight: 'bold',
      color: 'fg',
    },
    description: {
      fontSize: 'sm',
      color: 'fg',
    },
  },
})
