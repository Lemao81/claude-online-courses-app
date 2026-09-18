import { Heading, Stack } from '@chakra-ui/react'
import { getRouteApi } from '@tanstack/react-router'
import { useState } from 'react'
import CourseChapterList from '#/components/chapters/CourseChapterList'
import AddLessonButton from '#/components/lessons/AddLessonButton'
import LessonList from '#/components/lessons/LessonList'
import VideoUpload from '#/components/videos/VideoUpload'

const routeApi = getRouteApi('/editcourse/$courseId')

export default function EditCoursePage() {
  const course = routeApi.useLoaderData()
  const [newLessonId, setNewLessonId] = useState<number>()

  return (
    <Stack gap="8" px="4" py="6" data-course-id={course.id}>
      <Stack as="section" gap="3">
        <Heading as="h2" m="0" textStyle="sectionLabel">
          Lessons
        </Heading>
        <LessonList lessons={course.lessons} newLessonId={newLessonId} />
        <AddLessonButton courseId={course.id} onAdded={(l) => setNewLessonId(l.id)} />
        <VideoUpload courseId={course.id} onAdded={(l) => setNewLessonId(l.id)} />
      </Stack>
      <Stack as="section" gap="3">
        <Heading as="h2" m="0" textStyle="sectionLabel">
          Chapters
        </Heading>
        <CourseChapterList courseId={course.id} chapters={course.chapters} />
      </Stack>
    </Stack>
  )
}
