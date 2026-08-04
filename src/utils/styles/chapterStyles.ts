import type { SystemStyleObject } from '@chakra-ui/react'
import { chipButtonStyles } from '#/utils/styles/buttonStyles'

export const chapterPanelStyles: SystemStyleObject = {
  rounded: '1.25rem',
  borderWidth: '1px',
  borderColor: 'var(--line)',
  bg: 'linear-gradient(165deg, var(--surface-strong), var(--surface))',
  px: '1.25rem',
  py: '1.15rem',
}

export const chapterSectionLabelStyles: SystemStyleObject = {
  m: '0',
  fontSize: 'xs',
  fontWeight: 'semibold',
  letterSpacing: 'wider',
  textTransform: 'uppercase',
  color: 'var(--sea-ink-soft)',
}

export const chapterTitleStyles: SystemStyleObject = {
  m: '0',
  fontSize: '1rem',
  fontWeight: 'bold',
  color: 'var(--sea-ink)',
}

export const chapterDescriptionStyles: SystemStyleObject = {
  m: '0',
  fontSize: 'sm',
  color: 'var(--sea-ink-soft)',
}

export const chapterMetaStyles: SystemStyleObject = {
  m: '0',
  fontSize: 'xs',
  color: 'var(--sea-ink-soft)',
}

export const chapterEditButtonStyles: SystemStyleObject = {
  ...chipButtonStyles,
  px: '2',
  py: '2',
  _hover: { transform: 'translateY(-2px)', color: 'var(--sea-ink)' },
}

export const chapterCloseButtonStyles: SystemStyleObject = {
  color: 'var(--sea-ink-soft)',
  _hover: { bg: 'var(--link-bg-hover)', color: 'var(--sea-ink)' },
}

export const lessonRowStyles: SystemStyleObject = {
  rounded: '0.85rem',
  borderWidth: '1px',
  borderColor: 'var(--line)',
  bg: 'color-mix(in oklab, var(--surface-strong) 74%, transparent)',
  px: '0.9rem',
  py: '0.65rem',
}

export const lessonIconStyles: SystemStyleObject = {
  display: 'grid',
  placeItems: 'center',
  flexShrink: '0',
  w: '2rem',
  h: '2rem',
  rounded: '0.6rem',
  borderWidth: '1px',
  borderColor: 'var(--chip-line)',
  bg: 'var(--chip-bg)',
  color: 'var(--lagoon-deep)',
}

export const lessonTitleStyles: SystemStyleObject = {
  m: '0',
  fontSize: 'sm',
  fontWeight: 'semibold',
  color: 'var(--sea-ink)',
}

export const lessonMetaStyles: SystemStyleObject = {
  m: '0',
  fontSize: 'xs',
  color: 'var(--sea-ink-soft)',
}

export const lessonRemoveButtonStyles: SystemStyleObject = {
  color: 'var(--sea-ink-soft)',
  _hover: { bg: 'var(--link-bg-hover)', color: 'var(--sea-ink)' },
}

export const lessonEmptyStyles: SystemStyleObject = {
  m: '0',
  rounded: '0.85rem',
  borderWidth: '1px',
  borderStyle: 'dashed',
  borderColor: 'var(--line)',
  px: '1rem',
  py: '1.25rem',
  textAlign: 'center',
  fontSize: 'sm',
  color: 'var(--sea-ink-soft)',
}
