import { Flex } from '@chakra-ui/react'
import { getRouteApi } from '@tanstack/react-router'
import { useState } from 'react'
import CourseChapter from '#/components/chapters/CourseChapter'
import EditChapter from '#/components/chapters/EditChapter'

const routeApi = getRouteApi('/editcourse/$courseId')

export default function EditCoursePage() {
  const course = routeApi.useLoaderData()
  const [editedChapterId, setEditedChapterId] = useState<number | null>(null)

  return (
    <Flex direction="column" gap="4" px="4" py="6" data-course-id={course.id}>
      {course.chapters.map((c) =>
        c.id === editedChapterId ? (
          <EditChapter
            key={c.id}
            chapter={c}
            lessons={c.lessons}
            onClose={() => setEditedChapterId(null)}
          />
        ) : (
          <CourseChapter
            key={c.id}
            chapter={c}
            lessons={c.lessons}
            onEdit={() => setEditedChapterId(c.id)}
          />
        ),
      )}
    </Flex>
  )
}
