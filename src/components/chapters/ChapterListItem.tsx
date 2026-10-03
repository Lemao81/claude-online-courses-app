import { Box } from '@chakra-ui/react'
import CourseChapter from '#/components/chapters/CourseChapter'
import EditChapter from '#/components/chapters/EditChapter'
import { useChapterSortable } from '#/hooks/useChapterSortable'
import type { ChapterWithLessons } from '#/types'

type ChapterListItemProps = {
  chapter: ChapterWithLessons
  index: number
  isEdited: boolean
  isNew: boolean
  onEdit: () => void
  onClose: () => void
}

export default function ChapterListItem({
  chapter,
  index,
  isEdited,
  isNew,
  onEdit,
  onClose,
}: ChapterListItemProps) {
  const { ref, handleRef } = useChapterSortable(chapter.id, index)

  return (
    <Box ref={ref}>
      {isEdited ? (
        <EditChapter
          chapter={chapter}
          lessons={chapter.lessons}
          focusTitle={isNew}
          handleRef={handleRef}
          onClose={onClose}
        />
      ) : (
        <CourseChapter
          chapter={chapter}
          number={index + 1}
          lessons={chapter.lessons}
          handleRef={handleRef}
          onEdit={onEdit}
        />
      )}
    </Box>
  )
}
