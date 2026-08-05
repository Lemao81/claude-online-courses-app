import { Flex, Heading } from '@chakra-ui/react'
import { getRouteApi } from '@tanstack/react-router'
import CourseList from '#/components/courses/CourseList'
import CreateCourseDialog from '#/components/courses/CreateCourseDialog'

const routeApi = getRouteApi('/mycourses')

export default function MyCoursesPage() {
  const courses = routeApi.useLoaderData()

  return (
    <Flex direction="column" gap="4" w="full" maxW="4xl" mx="auto" px="4" py="6">
      <Flex align="center" justify="space-between" gap="3">
        <Heading as="h1" m="0" fontSize="xl" color="fg">
          My Courses
        </Heading>
        <CreateCourseDialog />
      </Flex>
      <CourseList courses={courses} />
    </Flex>
  )
}
