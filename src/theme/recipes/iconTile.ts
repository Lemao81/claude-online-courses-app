import { defineRecipe } from '@chakra-ui/react'

export const iconTileRecipe = defineRecipe({
  base: {
    display: 'grid',
    placeItems: 'center',
    borderWidth: '1px',
    borderColor: 'border',
    bg: 'bg.subtle',
    color: 'accent.fg',
  },
  variants: {
    size: {
      sm: {
        flexShrink: '0',
        w: '2rem',
        h: '2rem',
        rounded: 'icon',
      },
      lg: {
        w: '3rem',
        h: '3rem',
        rounded: 'full',
      },
    },
  },
  defaultVariants: {
    size: 'sm',
  },
})
