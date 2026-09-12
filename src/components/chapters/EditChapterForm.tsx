import { Field, Input, Stack, Textarea } from '@chakra-ui/react'
import { useForm } from '@tanstack/react-form'
import ErrorText from '#/components/ui/ErrorText'
import { autoSaveDebounceMs } from '#/config/constants'
import type { Chapter } from '#/types'

export type EditChapterFormValues = {
  title: string
  description: string
}

function toFormId(chapter?: Chapter): string {
  return `edit-chapter-form-${chapter?.id ?? 'new'}`
}

export function useEditChapterForm(chapter: Chapter | undefined) {
  const form = useForm({
    defaultValues: {
      title: chapter?.title ?? '',
      description: chapter?.description ?? '',
    },
  })

  return { form, formId: toFormId(chapter) }
}

type EditChapterFormProps = {
  form: ReturnType<typeof useEditChapterForm>['form']
  formId: string
  autoSaveError: string
  onAutoSave: (value: EditChapterFormValues) => void
}

export default function EditChapterForm({
  form,
  formId,
  autoSaveError,
  onAutoSave,
}: EditChapterFormProps) {
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
        <ErrorText message={autoSaveError} />
      </Stack>
    </form>
  )
}
