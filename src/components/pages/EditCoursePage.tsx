import { Box } from '@chakra-ui/react'
import { getRouteApi } from '@tanstack/react-router'
import CourseChapterList from '#/components/chapters/CourseChapterList'

const routeApi = getRouteApi('/editcourse/$courseId')

export default function EditCoursePage() {
  const course = routeApi.useLoaderData()

  return (
    <Box px="4" py="6" data-course-id={course.id}>
      <CourseChapterList chapters={course.chapters} />
    </Box>
  )
}
