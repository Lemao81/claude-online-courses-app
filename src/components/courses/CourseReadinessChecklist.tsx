import { Flex, Heading, Link, Stack, Text } from '@chakra-ui/react'
import { LuTriangleAlert } from 'react-icons/lu'
import { readinessChecklistId } from '@/constants'
import type { CourseOutline } from '@/types'
import { revealElement } from '@/utils/helpers'
import { toLessonElementId } from '@/utils/outline-helpers'
import { getCourseReadiness, toReadinessNote } from '@/utils/readiness-helpers'

type CourseReadinessChecklistProps = {
  course: CourseOutline
}

export default function CourseReadinessChecklist({
  course,
}: CourseReadinessChecklistProps): React.JSX.Element | null {
  const readiness = getCourseReadiness(course)
  const readinessNote = toReadinessNote(readiness)

  if (course.status === 'archived' || readinessNote === null) {
    return null
  }

  const hint = !readiness.hasLessons
    ? 'Add a lesson before publishing.'
    : course.status === 'draft'
      ? 'Every lesson needs a ready video before publishing.'
      : 'Learners only see lessons with a ready video.'

  return (
    <Stack
      as="section"
      id={readinessChecklistId}
      tabIndex={-1}
      aria-labelledby={`${readinessChecklistId}-heading`}
      gap="3"
      layerStyle="card"
    >
      <Flex align="center" gap="2" color="fg.error">
        <LuTriangleAlert aria-hidden="true" />
        <Heading as="h2" id={`${readinessChecklistId}-heading`} m="0" textStyle="title">
          {readinessNote}
        </Heading>
      </Flex>
      <Text textStyle="subtitle">{hint}</Text>
      {readiness.lessonsMissingVideo.length > 0 && (
        <Stack as="ul" gap="1" m="0" p="0" listStyleType="none">
          {readiness.lessonsMissingVideo.map((l) => (
            <li key={l.id}>
              <Link asChild color="accent.fg">
                <button type="button" onClick={() => revealElement(toLessonElementId(l.id))}>
                  {l.title}
                </button>
              </Link>
            </li>
          ))}
        </Stack>
      )}
    </Stack>
  )
}
