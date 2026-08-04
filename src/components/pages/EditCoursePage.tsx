import { Flex } from '@chakra-ui/react'
import { getRouteApi } from '@tanstack/react-router'
import EditChapter from '#/components/chapters/EditChapter'

const routeApi = getRouteApi('/editcourse/$courseId')

export default function EditCoursePage() {
  const course = routeApi.useLoaderData()

  return (
    <Flex direction="column" gap="4" px="4" py="6" data-course-id={course.id}>
      {course.chapters.map((c) => (
        <EditChapter key={c.id} chapter={c} />
      ))}
    </Flex>
  )
}
