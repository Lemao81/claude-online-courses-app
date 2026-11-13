import { IconButton, Menu, Portal } from '@chakra-ui/react'
import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { LuArchive, LuEllipsisVertical } from 'react-icons/lu'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { archiveCourse } from '@/server/functions/courses-functions'
import type { Course } from '@/types'

type CourseOverflowMenuProps = {
  course: Course
}

export default function CourseOverflowMenu({ course }: CourseOverflowMenuProps): React.JSX.Element {
  const router = useRouter()
  const [isArchiveOpen, setIsArchiveOpen] = useState(false)

  async function handleArchiveConfirm(): Promise<void> {
    await archiveCourse({ data: { id: course.id } })
    await router.invalidate()
  }

  return (
    <>
      <Menu.Root>
        <Menu.Trigger asChild>
          <IconButton size="sm" variant="quiet" aria-label="More course actions">
            <LuEllipsisVertical aria-hidden="true" />
          </IconButton>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="archive" color="fg.error" onSelect={() => setIsArchiveOpen(true)}>
                <LuArchive aria-hidden="true" />
                Archive course
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
      <ConfirmDialog
        open={isArchiveOpen}
        onOpenChange={setIsArchiveOpen}
        title="Archive Course"
        question={`Do you really want to archive "${course.title}"?`}
        description="Archiving is permanent: the course leaves the catalog and can no longer be edited. Learners already enrolled keep their access."
        confirmLabel="Archive"
        onConfirm={handleArchiveConfirm}
      />
    </>
  )
}
