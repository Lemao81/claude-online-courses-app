import { defineRecipe, type SystemStyleObject } from '@chakra-ui/react'

const statusStyles: SystemStyleObject = {
  flexShrink: '0',
  rounded: 'full',
  borderWidth: '1px',
  textTransform: 'capitalize',
}

export const badgeRecipe = defineRecipe({
  variants: {
    variant: {
      draft: {
        ...statusStyles,
        borderColor: 'border',
        bg: 'bg.panel',
        color: 'fg.muted',
      },
      published: {
        ...statusStyles,
        borderColor: 'border.accent',
        bg: 'accent.muted',
        color: 'fg',
      },
      archived: {
        ...statusStyles,
        borderColor: 'border.error',
        bg: 'bg.error',
        color: 'fg.muted',
      },
    },
  },
})
