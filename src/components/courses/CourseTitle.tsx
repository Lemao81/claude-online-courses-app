import { Badge, Flex, Stack, Text } from '@chakra-ui/react'
import type { Course } from '#/types'
import { formatDate, formatDuration, formatPrice, formatRating } from '#/utils/formatters'

type CourseTitleProps = {
  course: Course
}

export default function CourseTitle({ course }: CourseTitleProps) {
  const meta = [
    formatDuration(course.durationSec),
    formatPrice(course.price),
    formatRating(course.rating, course.ratingCount),
    `Updated ${formatDate(course.updatedAt)}`,
  ].join(' · ')

  return (
    <Stack gap="1" minW="0">
      <Flex align="center" gap="2" minW="0">
        <Text textStyle="title">{course.title}</Text>
        <Badge variant={course.status}>{course.status}</Badge>
      </Flex>
      <Text textStyle="subtitle">{course.subtitle}</Text>
      <Text textStyle="meta">{meta}</Text>
    </Stack>
  )
}
