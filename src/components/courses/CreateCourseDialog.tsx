import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
  Portal,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react'
import { useForm } from '@tanstack/react-form'
import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { LuPlus } from 'react-icons/lu'
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
  fieldControlStyles,
  fieldLabelStyles,
  fieldRequiredIndicatorStyles,
  formErrorStyles,
  textareaControlStyles,
} from '#/utils/styles/formStyles'

const formId = 'create-course-form'

const defaultValues = {
  title: '',
  subtitle: '',
  description: '',
}

export default function CreateCourseDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      setSubmitError('')
      try {
        await createCourse({ data: value })
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : 'Failed to create the course')

        return
      }
      handleOpenChange(false)
      await router.invalidate()
    },
  })

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
              <form
                id={formId}
                onSubmit={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  form.handleSubmit()
                }}
              >
                <Stack gap="4">
                  <form.Field name="title">
                    {(field) => (
                      <Field.Root required>
                        <Field.Label css={fieldLabelStyles}>
                          Title
                          <Field.RequiredIndicator css={fieldRequiredIndicatorStyles} />
                        </Field.Label>
                        <Input
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => field.handleChange(event.target.value)}
                          css={fieldControlStyles}
                        />
                      </Field.Root>
                    )}
                  </form.Field>
                  <form.Field name="subtitle">
                    {(field) => (
                      <Field.Root>
                        <Field.Label css={fieldLabelStyles}>Subtitle</Field.Label>
                        <Input
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => field.handleChange(event.target.value)}
                          css={fieldControlStyles}
                        />
                      </Field.Root>
                    )}
                  </form.Field>
                  <form.Field name="description">
                    {(field) => (
                      <Field.Root>
                        <Field.Label css={fieldLabelStyles}>Description</Field.Label>
                        <Textarea
                          name={field.name}
                          rows={4}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => field.handleChange(event.target.value)}
                          css={textareaControlStyles}
                        />
                      </Field.Root>
                    )}
                  </form.Field>
                  {submitError !== '' && (
                    <Text css={formErrorStyles} role="alert">
                      {submitError}
                    </Text>
                  )}
                </Stack>
              </form>
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
                  isSubmitting: state.isSubmitting,
                })}
              >
                {({ isTitleEmpty, isSubmitting }) => (
                  <Button
                    type="submit"
                    form={formId}
                    variant="plain"
                    disabled={isTitleEmpty || isSubmitting}
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
