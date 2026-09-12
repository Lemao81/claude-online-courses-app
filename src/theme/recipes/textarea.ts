import { defineRecipe } from '@chakra-ui/react'
import { controlStyles } from './input'

export const textareaRecipe = defineRecipe({
  variants: {
    variant: {
      field: {
        ...controlStyles,
        minH: '7rem',
        py: '0.8rem',
        resize: 'vertical',
      },
    },
  },
  defaultVariants: {
    variant: 'field',
  },
})
