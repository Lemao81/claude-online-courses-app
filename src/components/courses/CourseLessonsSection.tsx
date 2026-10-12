import { Box, Flex, Heading, Stack } from '@chakra-ui/react'
import { useState } from 'react'
import AddLessonButton from '@/components/lessons/AddLessonButton'
import LessonList from '@/components/lessons/LessonList'
import VideoUpload from '@/components/videos/VideoUpload'
import type { LessonVideo } from '@/types'

type CourseLessonsSectionProps = {
  courseId: number
  lessons: LessonVideo[]
}

export default function CourseLessonsSection({
  courseId,
  lessons,
}: CourseLessonsSectionProps): React.JSX.Element {
  const [newLessonId, setNewLessonId] = useState<number>()

  return (
    <Stack as="section" gap="3">
      <Heading as="h2" m="0" textStyle="sectionHeading">
        Lessons
      </Heading>
      <LessonList chapterId={null} lessons={lessons} newLessonId={newLessonId} />
      <Flex align="center" justify="center" gap="4" wrap="wrap" w="full" maxW="32rem" mx="auto">
        <AddLessonButton courseId={courseId} onAdded={(l) => setNewLessonId(l.id)} />
        <Box flex="1" minW="16rem">
          <VideoUpload courseId={courseId} onAdded={(l) => setNewLessonId(l.id)} />
        </Box>
      </Flex>
    </Stack>
  )
}
