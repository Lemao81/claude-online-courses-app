import { Stack, Text } from '@chakra-ui/react'
import CourseListItem from '#/components/courses/CourseListItem'
import { courseEmptyStyles } from '#/utils/styles/courseListStyles'
import type { Course } from '#/utils/types'

type CourseListProps = {
  courses: Course[]
}

export default function CourseList({ courses }: CourseListProps) {
  if (courses.length === 0) {
    return <Text css={courseEmptyStyles}>You have not created any courses yet.</Text>
  }

  return (
    <Stack gap="3">
      {courses.map((c) => <CourseListItem key={c.id} course={c} />)}
    </Stack>
  )
}
