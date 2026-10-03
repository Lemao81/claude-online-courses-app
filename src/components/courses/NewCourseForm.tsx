import { Field, Input, Stack, Textarea } from '@chakra-ui/react'
import { useForm } from '@tanstack/react-form'
import ErrorText from '#/components/ui/ErrorText'

const formId = 'new-course-form'

export type NewCourseFormValues = {
  title: string
  subtitle: string
  description: string
}

const defaultValues: NewCourseFormValues = {
  title: '',
  subtitle: '',
  description: '',
}

export function useNewCourseForm(onSubmit: (value: NewCourseFormValues) => Promise<void>) {
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => await onSubmit(value),
  })

  return { form, formId }
}

type NewCourseFormProps = {
  form: ReturnType<typeof useNewCourseForm>['form']
  submitError: string
}

export default function NewCourseForm({ form, submitError }: NewCourseFormProps) {
  return (
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
              <Field.Label>
                Title
                <Field.RequiredIndicator />
              </Field.Label>
              <Input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </Field.Root>
          )}
        </form.Field>
        <form.Field name="subtitle">
          {(field) => (
            <Field.Root required>
              <Field.Label>
                Subtitle
                <Field.RequiredIndicator />
              </Field.Label>
              <Input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </Field.Root>
          )}
        </form.Field>
        <form.Field name="description">
          {(field) => (
            <Field.Root>
              <Field.Label>Description</Field.Label>
              <Textarea
                name={field.name}
                rows={4}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </Field.Root>
          )}
        </form.Field>
        <ErrorText message={submitError} />
      </Stack>
    </form>
  )
}
