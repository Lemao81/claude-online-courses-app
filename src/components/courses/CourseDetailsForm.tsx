import { Field, Input, InputGroup, Stack, Textarea } from '@chakra-ui/react'
import { useForm } from '@tanstack/react-form'
import ErrorText from '@/components/ui/ErrorText'
import { autoSaveDebounceMs } from '@/constants/config'
import type { Course, FormApi } from '@/types'

export type CourseDetailsFormValues = {
  title: string
  subtitle: string
  description: string
  price: string
}

type CourseDetailsFormState = {
  form: FormApi<CourseDetailsFormValues>
  formId: string
}

export function useCourseDetailsForm(course: Course): CourseDetailsFormState {
  const form = useForm({
    defaultValues: {
      title: course.title,
      subtitle: course.subtitle,
      description: course.description,
      price: course.price,
    },
  })

  return { form, formId: `course-details-form-${course.id}` }
}

type CourseDetailsFormProps = {
  form: ReturnType<typeof useCourseDetailsForm>['form']
  formId: string
  autoSaveError: string
  onAutoSave: (value: CourseDetailsFormValues) => void
}

function blurOnEnter(event: React.KeyboardEvent<HTMLInputElement>): void {
  if (event.key === 'Enter') {
    event.currentTarget.blur()
  }
}

export default function CourseDetailsForm({
  form,
  formId,
  autoSaveError,
  onAutoSave,
}: CourseDetailsFormProps): React.JSX.Element {
  return (
    <form id={formId} onSubmit={(e) => e.preventDefault()}>
      <Stack gap="4">
        <form.Field
          name="title"
          listeners={{
            onChangeDebounceMs: autoSaveDebounceMs,
            onChange: ({ fieldApi }) => onAutoSave(fieldApi.form.state.values),
            onUnmount: ({ fieldApi }) => onAutoSave(fieldApi.form.state.values),
          }}
        >
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
                onKeyDown={blurOnEnter}
              />
            </Field.Root>
          )}
        </form.Field>
        <form.Field
          name="subtitle"
          listeners={{
            onChangeDebounceMs: autoSaveDebounceMs,
            onChange: ({ fieldApi }) => onAutoSave(fieldApi.form.state.values),
            onUnmount: ({ fieldApi }) => onAutoSave(fieldApi.form.state.values),
          }}
        >
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
                onKeyDown={blurOnEnter}
              />
            </Field.Root>
          )}
        </form.Field>
        <form.Field
          name="description"
          listeners={{
            onChangeDebounceMs: autoSaveDebounceMs,
            onChange: ({ fieldApi }) => onAutoSave(fieldApi.form.state.values),
            onUnmount: ({ fieldApi }) => onAutoSave(fieldApi.form.state.values),
          }}
        >
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
        <form.Field
          name="price"
          listeners={{
            onBlur: ({ fieldApi }) => onAutoSave(fieldApi.form.state.values),
            onUnmount: ({ fieldApi }) => onAutoSave(fieldApi.form.state.values),
          }}
        >
          {(field) => (
            <Field.Root maxW="12rem">
              <Field.Label>Price</Field.Label>
              <InputGroup startElement="$">
                <Input
                  name={field.name}
                  inputMode="decimal"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onKeyDown={blurOnEnter}
                />
              </InputGroup>
            </Field.Root>
          )}
        </form.Field>
        <ErrorText message={autoSaveError} />
      </Stack>
    </form>
  )
}
