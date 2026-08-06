import { Field, Input, Stack, Text, Textarea } from '@chakra-ui/react'
import { useForm } from '@tanstack/react-form'
import { autoSaveDebounceMs } from '#/config/constants'
import {
  fieldControlStyles,
  fieldLabelStyles,
  fieldRequiredIndicatorStyles,
  formErrorStyles,
  textareaControlStyles,
} from '#/utils/styles/formStyles'
import type { Chapter } from '#/utils/types'

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
        {autoSaveError !== '' && (
          <Text css={formErrorStyles} role="alert">
            {autoSaveError}
          </Text>
        )}
      </Stack>
    </form>
  )
}
