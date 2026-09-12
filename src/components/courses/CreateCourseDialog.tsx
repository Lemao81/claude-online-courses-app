import { Button, CloseButton, Dialog, Portal } from '@chakra-ui/react'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { LuPlus } from 'react-icons/lu'
import CreateCourseForm, {
  type CreateCourseFormValues,
  useCreateCourseForm,
} from '#/components/courses/CreateCourseForm'
import { createCourse } from '#/server/functions/courses.functions'
import type { Course } from '#/types'

export default function CreateCourseDialog() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const { form, formId } = useCreateCourseForm(handleSubmit)

  async function handleSubmit(value: CreateCourseFormValues): Promise<void> {
    setSubmitError('')
    let course: Course
    try {
      course = await createCourse({ data: value })
    } catch (error) {
      console.error(error)
      setSubmitError(error instanceof Error ? error.message : 'Failed to create the course')

      return
    }

    handleOpenChange(false)
    await navigate({
      to: '/editcourse/$courseId',
      params: { courseId: String(course.id) },
    })
  }

  function handleOpenChange(isOpen: boolean): void {
    setOpen(isOpen)
    if (!isOpen) {
      setSubmitError('')
      form.reset()
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(d) => handleOpenChange(d.open)} placement="center">
      <Dialog.Trigger asChild>
        <Button type="button" variant="chip">
          <LuPlus aria-hidden="true" />
          Create Course
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Create Course</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <CreateCourseForm form={form} submitError={submitError} />
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <form.Subscribe
                selector={(state) => ({
                  isTitleEmpty: state.values.title.trim().length === 0,
                  isSubtitleEmpty: state.values.subtitle.trim().length === 0,
                  isSubmitting: state.isSubmitting,
                })}
              >
                {({ isTitleEmpty, isSubtitleEmpty, isSubmitting }) => (
                  <Button
                    type="submit"
                    form={formId}
                    variant="primary"
                    disabled={isTitleEmpty || isSubtitleEmpty || isSubmitting}
                  >
                    {isSubmitting ? 'Creating…' : 'OK'}
                  </Button>
                )}
              </form.Subscribe>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" variant="quiet" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
