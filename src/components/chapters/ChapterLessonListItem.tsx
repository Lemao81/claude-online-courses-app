import { Flex } from '@chakra-ui/react'
import LessonMoveMenu from '@/components/lessons/LessonMoveMenu'
import LessonSummary from '@/components/lessons/LessonSummary'
import DragHandle from '@/components/ui/DragHandle'
import { useLessonSortable } from '@/hooks/use-lesson-sortable'
import type { LessonVideo } from '@/types'
import { toLessonElementId } from '@/utils/outline-helpers'

type ChapterLessonListItemProps = {
  lesson: LessonVideo
  index: number
  chapterId: number
}

export default function ChapterLessonListItem({
  lesson,
  index,
  chapterId,
}: ChapterLessonListItemProps): React.JSX.Element {
  const { ref, handleRef } = useLessonSortable(lesson.id, index, chapterId)

  return (
    <Flex
      ref={ref}
      id={toLessonElementId(lesson.id)}
      tabIndex={-1}
      align="center"
      justify="space-between"
      gap="3"
      layerStyle="row"
    >
      <Flex align="center" gap="3" minW="0" flex="1">
        <DragHandle ref={handleRef} label={`Reorder ${lesson.title}`} />
        <LessonSummary lesson={lesson} />
      </Flex>
      <LessonMoveMenu lesson={lesson} chapterId={chapterId} />
    </Flex>
  )
}
