import { Button, Flex, Stack, Text } from '@chakra-ui/react'
import { Link as RouterLink } from '@tanstack/react-router'
import { LuPencil } from 'react-icons/lu'
import { Tooltip } from '#/components/ui/tooltip'
import { formatDate, formatDuration, formatPrice, formatRating } from '#/utils/formatters'
import {
  courseEditButtonStyles,
  courseItemStyles,
  courseMetaStyles,
  courseStatusStyles,
  courseSubtitleStyles,
  courseTitleStyles,
} from '#/utils/styles/courseListStyles'
import type { Course } from '#/utils/types'

type CourseListItemProps = {
  course: Course
}

export default function CourseListItem({ course }: CourseListItemProps) {
  const meta = [
    formatDuration(course.durationSec),
    formatPrice(course.price),
    formatRating(course.rating, course.ratingCount),
    `Updated ${formatDate(course.updatedAt)}`,
  ].join(' · ')

  return (
    <Flex align="center" justify="space-between" gap="4" css={courseItemStyles}>
      <Stack gap="1" minW="0">
        <Flex align="center" gap="2">
          <Text css={courseTitleStyles}>{course.title}</Text>
          <Text as="span" css={courseStatusStyles(course.status)}>
            {course.status}
          </Text>
        </Flex>
        <Text css={courseSubtitleStyles}>{course.subtitle}</Text>
        <Text css={courseMetaStyles}>{meta}</Text>
      </Stack>
      <Tooltip content="Edit" showArrow>
        <Button asChild variant="plain" css={courseEditButtonStyles}>
          <RouterLink
            to="/editcourse/$courseId"
            params={{ courseId: String(course.id) }}
            aria-label="Edit course"
          >
            <LuPencil aria-hidden="true" />
          </RouterLink>
        </Button>
      </Tooltip>
    </Flex>
  )
}
