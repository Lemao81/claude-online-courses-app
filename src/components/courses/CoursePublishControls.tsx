import { Badge, Button, Flex, Text } from '@chakra-ui/react'
import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { LuTriangleAlert } from 'react-icons/lu'
import { showErrorToast } from '@/components/ui/AppToaster'
import { publishCourse, unpublishCourse } from '@/server/functions/courses-functions'
import type { CourseOutline } from '@/types'
import { getCourseReadiness, toReadinessNote } from '@/utils/readiness-helpers'

type CoursePublishControlsProps = {
  course: CourseOutline
}

export default function CoursePublishControls({
  course,
}: CoursePublishControlsProps): React.JSX.Element {
  const router = useRouter()
  const [isChanging, setIsChanging] = useState(false)
  const isDraft = course.status === 'draft'
  const isArchived = course.status === 'archived'
  const readinessNote = toReadinessNote(getCourseReadiness(course))

  async function handleStatusChange(): Promise<void> {
    setIsChanging(true)
    try {
      const changeStatus = isDraft ? publishCourse : unpublishCourse
      await changeStatus({ data: { id: course.id } })
    } catch (error) {
      console.error(error)
      showErrorToast(
        isDraft ? 'The course was not published' : 'The course was not unpublished',
        error instanceof Error ? error.message : 'Failed to change the course status',
      )

      setIsChanging(false)

      return
    }

    await router.invalidate()
    setIsChanging(false)
  }

  return (
    <Flex
      gridArea="controls"
      justifySelf={{ base: 'center', md: 'end' }}
      align="center"
      justify={{ base: 'center', md: 'flex-end' }}
      wrap="wrap"
      columnGap="3"
      rowGap="2"
    >
      <Badge variant={course.status}>{course.status}</Badge>
      {!isArchived && readinessNote && (
        <Flex align="center" gap="1" textStyle="meta" color={isDraft ? 'fg.muted' : 'fg.error'}>
          {!isDraft && <LuTriangleAlert aria-hidden="true" />}
          {readinessNote}
        </Flex>
      )}
      {isDraft && Number(course.price) === 0 && <Text textStyle="meta">This course is free</Text>}
      {!isArchived && (
        <Button
          type="button"
          variant={isDraft ? 'primary' : 'secondary'}
          loading={isChanging}
          onClick={handleStatusChange}
        >
          {isDraft ? 'Publish' : 'Unpublish'}
        </Button>
      )}
    </Flex>
  )
}
