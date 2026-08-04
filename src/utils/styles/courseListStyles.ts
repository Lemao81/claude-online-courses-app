import type { SystemStyleObject } from '@chakra-ui/react'
import { emptyStateStyles } from '#/utils/styles/surfaceStyles'
import type { CourseStatus } from '#/utils/types'

const statusColors: Record<CourseStatus, SystemStyleObject> = {
  draft: {
    borderColor: 'var(--line)',
    bg: 'color-mix(in oklab, var(--surface-strong) 80%, transparent)',
    color: 'var(--sea-ink-soft)',
  },
  published: {
    borderColor: 'color-mix(in oklab, var(--lagoon-deep) 40%, var(--line))',
    bg: 'color-mix(in oklab, var(--lagoon) 20%, var(--surface-strong))',
    color: 'var(--sea-ink)',
  },
  archived: {
    borderColor: 'color-mix(in oklab, var(--danger) 28%, var(--line))',
    bg: 'color-mix(in oklab, var(--danger) 10%, var(--surface-strong))',
    color: 'var(--sea-ink-soft)',
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
  rounded: '1rem',
  borderWidth: '1px',
  borderColor: 'var(--line)',
  bg: 'linear-gradient(165deg, var(--surface-strong), var(--surface))',
  px: '1rem',
  py: '0.9rem',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  _hover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 26px rgba(30,90,72,0.1)',
  },
}

export const courseEmptyStyles: SystemStyleObject = {
  ...emptyStateStyles,
  rounded: '1rem',
  py: '2rem',
}
