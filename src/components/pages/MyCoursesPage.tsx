import { Flex, Heading } from '@chakra-ui/react'
import { getRouteApi } from '@tanstack/react-router'
import CourseList from '#/components/courses/CourseList'
import CreateCourseDialog from '#/components/courses/CreateCourseDialog'

const routeApi = getRouteApi('/mycourses')

export default function MyCoursesPage() {
  const courses = routeApi.useLoaderData()

  return (
    <Flex direction="column" gap="4" px="4" py="6">
      <Flex align="center" justify="space-between" gap="3">
        <Heading as="h1" m="0" fontSize="1.25rem" color="var(--sea-ink)">
          My Courses
        </Heading>
        <CreateCourseDialog />
      </Flex>
      <CourseList courses={courses} />
    </Flex>
  )
}
