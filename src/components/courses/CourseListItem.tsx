import { Badge, Button, Flex, Stack, Text } from '@chakra-ui/react'
import { Link as RouterLink, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { LuPencil, LuTrash2 } from 'react-icons/lu'
import ConfirmDialog from '#/components/ui/ConfirmDialog'
import Tooltip from '#/components/ui/Tooltip'
import { deleteCourse } from '#/server/functions/courses.functions'
import type { Course } from '#/types'
import { formatDate, formatDuration, formatPrice, formatRating } from '#/utils/formatters'

type CourseListItemProps = {
  course: Course
}

export default function CourseListItem({ course }: CourseListItemProps) {
  const router = useRouter()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const meta = [
    formatDuration(course.durationSec),
    formatPrice(course.price),
    formatRating(course.rating, course.ratingCount),
    `Updated ${formatDate(course.updatedAt)}`,
  ].join(' · ')

  async function handleDeleteConfirm(): Promise<void> {
    await deleteCourse({ data: { id: course.id } })
    await router.invalidate()
  }

  return (
    <Flex
      align={{ base: 'flex-start', sm: 'center' }}
      justify="space-between"
      gap="4"
      layerStyle="card"
    >
      <Stack gap="1" minW="0">
        <Flex align="center" gap="2" minW="0">
          <Text textStyle="title">{course.title}</Text>
          <Badge variant={course.status}>{course.status}</Badge>
        </Flex>
        <Text textStyle="subtitle">{course.subtitle}</Text>
        <Text textStyle="meta">{meta}</Text>
      </Stack>
      <Flex gap="2">
        <Tooltip content="Edit" showArrow>
          <Button asChild variant="chipIcon">
            <RouterLink
              to="/editcourse/$courseId"
              params={{ courseId: String(course.id) }}
              aria-label="Edit course"
            >
              <LuPencil aria-hidden="true" />
            </RouterLink>
          </Button>
        </Tooltip>
        {course.status === 'draft' && (
          <Tooltip content="Delete" showArrow>
            <Button
              variant="chipIcon"
              aria-label="Delete course"
              onClick={() => setIsDeleteOpen(true)}
            >
              <LuTrash2 aria-hidden="true" />
            </Button>
          </Tooltip>
        )}
      </Flex>
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Course"
        question={`Do you really want to delete "${course.title}"?`}
        description="Its chapters, lessons and videos are deleted permanently."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
      />
    </Flex>
  )
}
