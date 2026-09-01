import { Field, Input, Stack, Textarea } from '@chakra-ui/react'
import { useForm } from '@tanstack/react-form'
import ErrorText from '#/components/ui/ErrorText'
import {
  fieldControlStyles,
  fieldLabelStyles,
  fieldRequiredIndicatorStyles,
  textareaControlStyles,
} from '#/styles/formStyles'

const formId = 'create-course-form'

export type CreateCourseFormValues = {
  title: string
  subtitle: string
  description: string
}

const defaultValues: CreateCourseFormValues = {
  title: '',
  subtitle: '',
  description: '',
}

export function useCreateCourseForm(onSubmit: (value: CreateCourseFormValues) => Promise<void>) {
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => await onSubmit(value),
  })

  return { form, formId }
}

type CreateCourseFormProps = {
  form: ReturnType<typeof useCreateCourseForm>['form']
  submitError: string
}

export default function CreateCourseForm({ form, submitError }: CreateCourseFormProps) {
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
              <Field.Label css={fieldLabelStyles}>
                Title
                <Field.RequiredIndicator css={fieldRequiredIndicatorStyles} />
              </Field.Label>
              <Input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                css={fieldControlStyles}
              />
            </Field.Root>
          )}
        </form.Field>
        <form.Field name="subtitle">
          {(field) => (
            <Field.Root required>
              <Field.Label css={fieldLabelStyles}>
                Subtitle
                <Field.RequiredIndicator css={fieldRequiredIndicatorStyles} />
              </Field.Label>
              <Input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
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
                onChange={(e) => field.handleChange(e.target.value)}
                css={textareaControlStyles}
              />
            </Field.Root>
          )}
        </form.Field>
        <ErrorText message={submitError} />
      </Stack>
    </form>
  )
}
