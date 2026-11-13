import { Flex, Stack, Text } from '@chakra-ui/react'
import LessonSummary from '@/components/lessons/LessonSummary'
import type { LessonVideo } from '@/types'

type LessonViewListProps = {
  lessons: LessonVideo[]
  emptyText: string
}

export default function LessonViewList({
  lessons,
  emptyText,
}: LessonViewListProps): React.JSX.Element {
  if (lessons.length === 0) {
    return (
      <Text layerStyle="emptyStateRow" textStyle="emptyState">
        {emptyText}
      </Text>
    )
  }

  return (
    <Stack gap="2">
      {lessons.map((l) => (
        <Flex key={l.id} align="center" gap="3" layerStyle="row">
          <LessonSummary lesson={l} />
        </Flex>
      ))}
    </Stack>
  )
}
