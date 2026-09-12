import { defineRecipe } from '@chakra-ui/react'

const underlineStyles = {
  content: '""',
  position: 'absolute',
  left: '0',
  bottom: { base: '-4px', sm: '-6px' },
  w: 'full',
  h: '2px',
  bg: 'accent',
  transform: 'scaleX(0)',
  transformOrigin: 'left',
  transition: 'transform 170ms ease',
}

export const linkRecipe = defineRecipe({
  variants: {
    variant: {
      nav: {
        position: 'relative',
        color: 'fg.muted',
        textDecoration: 'none',
        _after: underlineStyles,
        _hover: {
          color: 'fg',
          _after: { transform: 'scaleX(1)' },
        },
        '&[data-status="active"]': {
          color: 'fg',
          _after: { transform: 'scaleX(1)' },
        },
      },
    },
  },
})
