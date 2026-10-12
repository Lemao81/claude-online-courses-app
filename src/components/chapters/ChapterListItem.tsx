import { Box } from '@chakra-ui/react'
import ChapterEditor from '@/components/chapters/ChapterEditor'
import ChapterView from '@/components/chapters/ChapterView'
import { useChapterSortable } from '@/hooks/use-chapter-sortable'
import type { ChapterWithLessons } from '@/types'

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
}: ChapterListItemProps): React.JSX.Element {
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
