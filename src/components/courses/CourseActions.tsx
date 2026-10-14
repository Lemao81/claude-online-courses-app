import { Button, Flex } from '@chakra-ui/react'
import { Link as RouterLink, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { LuPencil, LuTrash2 } from 'react-icons/lu'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Tooltip from '@/components/ui/Tooltip'
import { deleteCourse } from '@/server/functions/courses-functions'
import type { Course } from '@/types'

type CourseActionsProps = {
  course: Course
}

export default function CourseActions({ course }: CourseActionsProps): React.JSX.Element {
  const router = useRouter()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  async function handleDeleteConfirm(): Promise<void> {
    await deleteCourse({ data: { id: course.id } })
    await router.invalidate()
  }

  return (
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
