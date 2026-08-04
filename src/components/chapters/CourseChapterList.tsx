import { Stack } from '@chakra-ui/react'
import { useState } from 'react'
import CourseChapter from '#/components/chapters/CourseChapter'
import EditChapter from '#/components/chapters/EditChapter'
import type { ChapterWithLessons } from '#/utils/types'

type CourseChapterListProps = {
  chapters: ChapterWithLessons[]
}

export default function CourseChapterList({ chapters }: CourseChapterListProps) {
  const [editedChapterId, setEditedChapterId] = useState<number | null>(null)

  return (
    <Stack gap="4">
      {chapters.map((c) =>
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
    </Stack>
  )
}
