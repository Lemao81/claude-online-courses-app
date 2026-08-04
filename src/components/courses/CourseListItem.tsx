import { Badge, Button, Flex, Stack, Text } from '@chakra-ui/react'
import { Link as RouterLink } from '@tanstack/react-router'
import { LuPencil } from 'react-icons/lu'
import Tooltip from '#/components/ui/Tooltip'
import { formatDate, formatDuration, formatPrice, formatRating } from '#/utils/formatters'
import { chipIconButtonStyles } from '#/utils/styles/buttonStyles'
import { courseItemStyles, courseStatusStyles } from '#/utils/styles/courseListStyles'
import { metaStyles, subtitleStyles, titleStyles } from '#/utils/styles/textStyles'
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
          <Text css={titleStyles}>{course.title}</Text>
          <Badge variant="plain" css={courseStatusStyles(course.status)}>
            {course.status}
          </Badge>
        </Flex>
        <Text css={subtitleStyles}>{course.subtitle}</Text>
        <Text css={metaStyles}>{meta}</Text>
      </Stack>
      <Tooltip content="Edit" showArrow>
        <Button asChild variant="plain" css={chipIconButtonStyles}>
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
