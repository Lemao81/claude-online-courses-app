import { Box } from '@chakra-ui/react'
import ChapterView from '#/components/chapters/ChapterView'
import ChapterEditor from '#/components/chapters/ChapterEditor'
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
        <ChapterEditor
          chapter={chapter}
          lessons={chapter.lessons}
          focusTitle={isNew}
          handleRef={handleRef}
          onClose={onClose}
        />
      ) : (
        <ChapterView
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
