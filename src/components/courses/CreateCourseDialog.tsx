import { Button, CloseButton, Dialog, Portal } from '@chakra-ui/react'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { LuPlus } from 'react-icons/lu'
import CreateCourseForm, {
  type CreateCourseFormValues,
  useCreateCourseForm,
} from '#/components/courses/CreateCourseForm'
import { createCourse } from '#/server/functions/courses.functions'
import {
  chipButtonStyles,
  primaryButtonStyles,
  secondaryButtonStyles,
} from '#/utils/styles/buttonStyles'
import {
  dialogBackdropStyles,
  dialogCloseButtonStyles,
  dialogContentStyles,
  dialogTitleStyles,
} from '#/utils/styles/formStyles'
import type { Course } from '#/utils/types'

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
    <Dialog.Root
      open={open}
      onOpenChange={(details) => handleOpenChange(details.open)}
      placement="center"
    >
      <Dialog.Trigger asChild>
        <Button type="button" variant="plain" css={chipButtonStyles}>
          <LuPlus aria-hidden="true" />
          Create Course
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop css={dialogBackdropStyles} />
        <Dialog.Positioner>
          <Dialog.Content css={dialogContentStyles}>
            <Dialog.Header>
              <Dialog.Title css={dialogTitleStyles}>Create Course</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <CreateCourseForm form={form} submitError={submitError} />
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button type="button" variant="plain" css={secondaryButtonStyles}>
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
                    variant="plain"
                    disabled={isTitleEmpty || isSubtitleEmpty || isSubmitting}
                    css={primaryButtonStyles}
                  >
                    {isSubmitting ? 'Creating…' : 'OK'}
                  </Button>
                )}
              </form.Subscribe>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" variant="plain" css={dialogCloseButtonStyles} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
