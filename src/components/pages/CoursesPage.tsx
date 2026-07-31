import { Flex, Text } from '@chakra-ui/react'
import CreateCourseDialog from '#/components/courses/CreateCourseDialog'

export default function CoursesPage() {
  return (
    <Flex direction="column" gap="4" px="4" py="6">
      <Flex align="center" justify="space-between" gap="3">
        <Text m="0">Courses coming soon.</Text>
        <CreateCourseDialog />
      </Flex>
    </Flex>
  )
}
