import type { SystemStyleObject } from '@chakra-ui/react'
import { emptyStateStyles } from '#/utils/styles/surfaceStyles'

export const chapterPanelStyles: SystemStyleObject = {
  rounded: 'panel',
  borderWidth: '1px',
  borderColor: 'border',
  bg: 'linear-gradient(165deg, token(colors.bg.panel), token(colors.bg.subtle))',
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
  rounded: '0.6rem',
  borderWidth: '1px',
  borderColor: 'border.chip',
  bg: 'bg.chip',
  color: 'fg.accent',
}

export const lessonEmptyStyles: SystemStyleObject = {
  ...emptyStateStyles,
  rounded: 'control',
  py: '1.25rem',
}
