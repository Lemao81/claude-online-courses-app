import type { SystemStyleObject } from '@chakra-ui/react'

export const lessonIconStyles: SystemStyleObject = {
  display: 'grid',
  placeItems: 'center',
  flexShrink: '0',
  w: '2rem',
  h: '2rem',
  rounded: 'icon',
  borderWidth: '1px',
  borderColor: 'border',
  bg: 'bg.subtle',
  color: 'fg.emphasized',
}

export const lessonEmptyStyles: SystemStyleObject = {
  layerStyle: 'emptyState',
  textStyle: 'emptyState',
  rounded: 'control',
  py: '1.25rem',
}
