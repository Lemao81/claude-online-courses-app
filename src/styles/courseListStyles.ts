import type { SystemStyleObject } from '@chakra-ui/react'
import type { CourseStatus } from '#/types'

const statusColors: Record<CourseStatus, SystemStyleObject> = {
  draft: {
    borderColor: 'border',
    bg: 'bg.panel',
    color: 'fg.muted',
  },
  published: {
    borderColor: 'color-mix(in oklab, token(colors.fg.emphasized) 40%, token(colors.border))',
    bg: 'color-mix(in oklab, token(colors.accent) 20%, token(colors.bg.panel))',
    color: 'fg',
  },
  archived: {
    borderColor: 'color-mix(in oklab, token(colors.danger) 28%, token(colors.border))',
    bg: 'color-mix(in oklab, token(colors.danger) 10%, token(colors.bg.panel))',
    color: 'fg.muted',
  },
}

const statusBadgeBaseStyles: SystemStyleObject = {
  flexShrink: '0',
  rounded: 'full',
  borderWidth: '1px',
  textTransform: 'capitalize',
}

export function courseStatusStyles(status: CourseStatus): SystemStyleObject {
  return { ...statusBadgeBaseStyles, ...statusColors[status] }
}

export const courseItemStyles: SystemStyleObject = {
  rounded: 'card',
  borderWidth: '1px',
  borderColor: 'border',
  bg: 'bg.panel',
  px: '1rem',
  py: '0.9rem',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  _hover: {
    transform: 'translateY(-2px)',
    boxShadow: 'raised',
  },
}

export const courseEmptyStyles: SystemStyleObject = {
  layerStyle: 'emptyState',
  textStyle: 'emptyState',
  rounded: 'card',
  py: '2rem',
}
