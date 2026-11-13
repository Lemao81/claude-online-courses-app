import { Stack, Text } from '@chakra-ui/react'
import { LuVideo } from 'react-icons/lu'
import IconTile from '@/components/ui/IconTile'
import type { LessonVideo } from '@/types'
import { formatDuration } from '@/utils/formatters'

type LessonSummaryProps = {
  lesson: LessonVideo
}

export default function LessonSummary({ lesson }: LessonSummaryProps): React.JSX.Element {
  return (
    <>
      <IconTile>
        <LuVideo size={16} />
      </IconTile>
      <Stack gap="0.5" minW="0">
        <Text textStyle="itemTitle">{lesson.title}</Text>
        <Text textStyle="meta">{formatDuration(lesson.durationSec)}</Text>
      </Stack>
    </>
  )
}
