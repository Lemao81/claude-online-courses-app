import { Stack } from '@chakra-ui/react'
import { useState } from 'react'
import AddChapterButton from '#/components/chapters/AddChapterButton'
import CourseChapter from '#/components/chapters/CourseChapter'
import EditChapter from '#/components/chapters/EditChapter'
import type { ChapterWithLessons } from '#/types'

type CourseChapterListProps = {
  courseId: number
  chapters: ChapterWithLessons[]
}

export default function CourseChapterList({ courseId, chapters }: CourseChapterListProps) {
  const [editedChapterId, setEditedChapterId] = useState<number | null>(null)
  const [newChapterId, setNewChapterId] = useState<number | null>(null)

  function editChapter(id: number | null, isNew = false): void {
    setEditedChapterId(id)
    setNewChapterId(isNew ? id : null)
  }

  return (
    <Stack gap="4">
      {chapters.map((c) =>
        c.id === editedChapterId ? (
          <EditChapter
            key={c.id}
            chapter={c}
            lessons={c.lessons}
            focusTitle={c.id === newChapterId}
            onClose={() => editChapter(null)}
          />
        ) : (
          <CourseChapter
            key={c.id}
            chapter={c}
            lessons={c.lessons}
            onEdit={() => editChapter(c.id)}
          />
        ),
      )}
      <AddChapterButton courseId={courseId} onAdded={(c) => editChapter(c.id, true)} />
    </Stack>
  )
}
