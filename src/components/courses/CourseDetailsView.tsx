import { Heading, Stack, Text } from '@chakra-ui/react'
import CourseDetailsList from '@/components/courses/CourseDetailsList'
import CourseThumbnailImage from '@/components/courses/CourseThumbnailImage'
import type { Course } from '@/types'

type CourseDetailsViewProps = {
  course: Course
  thumbnailUrl: string | null
}

export default function CourseDetailsView({
  course,
  thumbnailUrl,
}: CourseDetailsViewProps): React.JSX.Element {
  return (
    <Stack as="section" gap="3">
      <Heading as="h2" m="0" textStyle="sectionHeading">
        Details
      </Heading>
      <Stack gap="6">
        <Stack gap="2" maxW="24rem">
          <Text textStyle="sectionLabel">Thumbnail</Text>
          <CourseThumbnailImage thumbnailUrl={thumbnailUrl} placeholder="No thumbnail" />
        </Stack>
        <CourseDetailsList course={course} />
      </Stack>
    </Stack>
  )
}
