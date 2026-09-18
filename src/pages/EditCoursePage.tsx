import { CloseButton, Grid, Heading, Stack } from '@chakra-ui/react'
import { getRouteApi, Link as RouterLink } from '@tanstack/react-router'
import { useState } from 'react'
import { LuArrowLeft } from 'react-icons/lu'
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
      <Grid templateColumns="1fr auto 1fr" alignItems="center" gap="3">
        <Heading as="h1" gridColumn="2" m="0" minW="0" fontSize="xl" color="fg" textAlign="center">
          {course.title}
        </Heading>
        <CloseButton asChild justifySelf="end" size="lg" variant="quiet">
          <RouterLink to="/mycourses" aria-label="Back to My Courses">
            <LuArrowLeft aria-hidden="true" />
          </RouterLink>
        </CloseButton>
      </Grid>
      <Stack as="section" gap="3">
        <Heading as="h2" m="0" textStyle="sectionHeading">
          Lessons
        </Heading>
        <LessonList lessons={course.lessons} newLessonId={newLessonId} />
        <AddLessonButton courseId={course.id} onAdded={(l) => setNewLessonId(l.id)} />
        <VideoUpload courseId={course.id} onAdded={(l) => setNewLessonId(l.id)} />
      </Stack>
      <Stack as="section" gap="3">
        <Heading as="h2" m="0" textStyle="sectionHeading">
          Chapters
        </Heading>
        <CourseChapterList courseId={course.id} chapters={course.chapters} />
      </Stack>
    </Stack>
  )
}
