import { defineRecipe } from '@chakra-ui/react'

export const dropZoneRecipe = defineRecipe({
  base: {
    position: 'relative',
    rounded: 'panel',
    borderWidth: '2px',
    borderStyle: 'dashed',
    borderColor: 'border',
    bg: 'bg.subtle',
    px: '1.5rem',
    py: '2.25rem',
    transition: 'border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease',
  },
  variants: {
    active: {
      true: {
        borderColor: 'border.focus',
        bg: 'accent.subtle',
        boxShadow: 'dropRing',
      },
    },
  },
})
