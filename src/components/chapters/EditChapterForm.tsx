import { Field, Input, Stack, Textarea } from '@chakra-ui/react'
import { useForm } from '@tanstack/react-form'
import {
  fieldControlStyles,
  fieldLabelStyles,
  fieldRequiredIndicatorStyles,
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

export function useEditChapterForm(
  chapter: Chapter | undefined,
  onSubmit: (value: EditChapterFormValues) => Promise<void>,
) {
  const form = useForm({
    defaultValues: {
      title: chapter?.title ?? '',
      description: chapter?.description ?? '',
    },
    onSubmit: async ({ value }) => await onSubmit(value),
  })

  return { form, formId: toFormId(chapter) }
}

type EditChapterFormProps = {
  form: ReturnType<typeof useEditChapterForm>['form']
  formId: string
}

export default function EditChapterForm({ form, formId }: EditChapterFormProps) {
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
      </Stack>
    </form>
  )
}
