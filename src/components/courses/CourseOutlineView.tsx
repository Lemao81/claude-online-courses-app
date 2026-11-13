import { Heading, Stack, Text } from '@chakra-ui/react'
import ChapterViewList from '@/components/chapters/ChapterViewList'
import LessonViewList from '@/components/lessons/LessonViewList'
import type { CourseOutline } from '@/types'

type CourseOutlineViewProps = {
  outline: CourseOutline
}

export default function CourseOutlineView({ outline }: CourseOutlineViewProps): React.JSX.Element {
  return (
    <>
      <Stack as="section" gap="3">
        <Heading as="h2" m="0" textStyle="sectionHeading">
          Lessons
        </Heading>
        <LessonViewList lessons={outline.lessons} emptyText="No lessons." />
      </Stack>
      <Stack as="section" gap="3">
        <Heading as="h2" m="0" textStyle="sectionHeading">
          Chapters
        </Heading>
        {outline.chapters.length === 0 ? (
          <Text layerStyle="emptyStateRow" textStyle="emptyState">
            No chapters.
          </Text>
        ) : (
          <ChapterViewList chapters={outline.chapters} />
        )}
      </Stack>
    </>
  )
}
