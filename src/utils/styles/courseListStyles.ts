import type { SystemStyleObject } from '@chakra-ui/react'
import { emptyStateStyles } from '#/utils/styles/surfaceStyles'
import type { CourseStatus } from '#/utils/types'

const statusColors: Record<CourseStatus, SystemStyleObject> = {
  draft: {
    borderColor: 'border',
    bg: 'color-mix(in oklab, token(colors.bg.panel) 80%, transparent)',
    color: 'fg.muted',
  },
  published: {
    borderColor: 'color-mix(in oklab, token(colors.accent.emphasized) 40%, token(colors.border))',
    bg: 'color-mix(in oklab, token(colors.accent) 20%, token(colors.bg.panel))',
    color: 'fg',
  },
  archived: {
    borderColor: 'color-mix(in oklab, token(colors.coral) 28%, token(colors.border))',
    bg: 'color-mix(in oklab, token(colors.coral) 10%, token(colors.bg.panel))',
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
  bgGradient: 'panel',
  px: '1rem',
  py: '0.9rem',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  _hover: {
    transform: 'translateY(-2px)',
    boxShadow: 'raised',
  },
}

export const courseEmptyStyles: SystemStyleObject = {
  ...emptyStateStyles,
  rounded: 'card',
  py: '2rem',
}
