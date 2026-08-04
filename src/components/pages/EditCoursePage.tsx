import { Flex } from '@chakra-ui/react'
import { getRouteApi } from '@tanstack/react-router'
import CourseChapter from '#/components/chapters/CourseChapter'

const routeApi = getRouteApi('/editcourse/$courseId')

export default function EditCoursePage() {
  const course = routeApi.useLoaderData()

  return (
    <Flex direction="column" gap="4" px="4" py="6" data-course-id={course.id}>
      {course.chapters.map((c) => (
        <CourseChapter key={c.id} chapter={c} lessons={c.lessons} />
      ))}
    </Flex>
  )
}
