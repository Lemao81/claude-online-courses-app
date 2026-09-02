import type { SystemStyleObject } from '@chakra-ui/react'
import { emptyStateStyles } from '#/styles/surfaceStyles'

export const chapterPanelStyles: SystemStyleObject = {
  rounded: 'panel',
  borderWidth: '1px',
  borderColor: 'border',
  bg: 'bg.panel',
  px: '1.25rem',
  py: '1.15rem',
}

export const chapterSectionLabelStyles: SystemStyleObject = {
  m: '0',
  fontSize: 'xs',
  fontWeight: 'semibold',
  letterSpacing: 'wider',
  textTransform: 'uppercase',
  color: 'fg.muted',
}

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
  ...emptyStateStyles,
  rounded: 'control',
  py: '1.25rem',
}
