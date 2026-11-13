import { Stack, Text } from '@chakra-ui/react'
import type { Course } from '@/types'
import { formatPrice } from '@/utils/formatters'

type CourseDetailsListProps = {
  course: Course
}

export default function CourseDetailsList({ course }: CourseDetailsListProps): React.JSX.Element {
  const details = [
    { label: 'Title', value: course.title },
    { label: 'Subtitle', value: course.subtitle },
    { label: 'Description', value: course.description },
    { label: 'Price', value: formatPrice(course.price) },
  ].filter((d) => d.value.length > 0)

  return (
    <Stack as="dl" gap="4" m="0">
      {details.map((d) => (
        <Stack key={d.label} gap="1">
          <Text as="dt" textStyle="sectionLabel">
            {d.label}
          </Text>
          <Text as="dd" m="0" whiteSpace="pre-wrap">
            {d.value}
          </Text>
        </Stack>
      ))}
    </Stack>
  )
}
