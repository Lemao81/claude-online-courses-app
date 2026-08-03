import { Flex } from '@chakra-ui/react'
import { getRouteApi } from '@tanstack/react-router'
import EditChapter from '#/components/chapters/EditChapter'
import type { ChapterLessonVideo } from '#/utils/types'

const routeApi = getRouteApi('/editcourse/$courseId')

const demoLessons: ChapterLessonVideo[] = [
  { id: 1, title: 'Welcome and setup', durationSec: 420 },
  { id: 2, title: 'Project structure tour', durationSec: 965 },
  { id: 3, title: 'Your first component', durationSec: 1580 },
]

export default function EditCoursePage() {
  const course = routeApi.useLoaderData()

  return (
    <Flex direction="column" gap="4" px="4" py="6" data-course-id={course.id}>
      <EditChapter lessons={demoLessons} />
    </Flex>
  )
}
