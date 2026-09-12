import { Stack, Text } from '@chakra-ui/react'
import CourseListItem from '#/components/courses/CourseListItem'
import type { Course } from '#/types'

type CourseListProps = {
  courses: Course[]
}

export default function CourseList({ courses }: CourseListProps) {
  if (courses.length === 0) {
    return (
      <Text layerStyle="emptyStateCard" textStyle="emptyState">
        You have not created any courses yet.
      </Text>
    )
  }

  return (
    <Stack gap="3">
      {courses.map((c) => (
        <CourseListItem key={c.id} course={c} />
      ))}
    </Stack>
  )
}
