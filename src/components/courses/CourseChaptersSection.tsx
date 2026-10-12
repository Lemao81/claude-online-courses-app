import { Heading, Stack } from '@chakra-ui/react'
import ChapterList from '@/components/chapters/ChapterList'
import type { ChapterWithLessons } from '@/types'

type CourseChaptersSectionProps = {
  courseId: number
  chapters: ChapterWithLessons[]
}

export default function CourseChaptersSection({
  courseId,
  chapters,
}: CourseChaptersSectionProps): React.JSX.Element {
  return (
    <Stack as="section" gap="3">
      <Heading as="h2" m="0" textStyle="sectionHeading">
        Chapters
      </Heading>
      <ChapterList courseId={courseId} chapters={chapters} />
    </Stack>
  )
}
