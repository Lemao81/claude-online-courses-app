import { Badge, Button, Flex, Stack, Text } from '@chakra-ui/react'
import { Link as RouterLink } from '@tanstack/react-router'
import { LuPencil } from 'react-icons/lu'
import Tooltip from '#/components/ui/Tooltip'
import { formatDate, formatDuration, formatPrice, formatRating } from '#/utils/formatters'
import type { Course } from '#/types'

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
    <Flex align="center" justify="space-between" gap="4" layerStyle="card">
      <Stack gap="1" minW="0">
        <Flex align="center" gap="2">
          <Text textStyle="title">{course.title}</Text>
          <Badge variant={course.status}>
            {course.status}
          </Badge>
        </Flex>
        <Text textStyle="subtitle">{course.subtitle}</Text>
        <Text textStyle="meta">{meta}</Text>
      </Stack>
      <Tooltip content="Edit" showArrow>
        <Button asChild variant="chipIcon">
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
