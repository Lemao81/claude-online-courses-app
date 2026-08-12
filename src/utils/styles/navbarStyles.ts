import type { SystemStyleObject } from '@chakra-ui/react'

export const demoLinkStyles: SystemStyleObject = {
  display: 'block',
  rounded: 'lg',
  px: '3',
  py: '2',
  fontSize: 'sm',
  color: 'fg.muted',
  textDecoration: 'none',
  transition: 'all 0.15s ease',
  _hover: { bg: 'bg.hover', color: 'fg' },
}
