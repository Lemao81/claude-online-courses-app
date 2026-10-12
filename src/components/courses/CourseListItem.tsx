import { Flex } from '@chakra-ui/react'
import CourseActions from '#/components/courses/CourseActions'
import CourseTitle from '#/components/courses/CourseTitle'
import type { Course } from '#/types'

type CourseListItemProps = {
  course: Course
}

export default function CourseListItem({ course }: CourseListItemProps) {
  return (
    <Flex
      align={{ base: 'flex-start', sm: 'center' }}
      justify="space-between"
      gap="4"
      layerStyle="card"
    >
      <CourseTitle course={course} />
      <CourseActions course={course} />
    </Flex>
  )
}
