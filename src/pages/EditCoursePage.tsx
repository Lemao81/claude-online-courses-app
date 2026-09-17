import { Heading, Stack } from '@chakra-ui/react'
import { getRouteApi } from '@tanstack/react-router'
import CourseChapterList from '#/components/chapters/CourseChapterList'
import LessonList from '#/components/lessons/LessonList'

const routeApi = getRouteApi('/editcourse/$courseId')

export default function EditCoursePage() {
  const course = routeApi.useLoaderData()

  return (
    <Stack gap="8" px="4" py="6" data-course-id={course.id}>
      <Stack as="section" gap="3">
        <Heading as="h2" m="0" textStyle="sectionLabel">
          Lessons
        </Heading>
        <LessonList lessons={course.lessons} />
      </Stack>
      <Stack as="section" gap="3">
        <Heading as="h2" m="0" textStyle="sectionLabel">
          Chapters
        </Heading>
        <CourseChapterList chapters={course.chapters} />
      </Stack>
    </Stack>
  )
}
