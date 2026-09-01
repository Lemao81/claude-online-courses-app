import { Editable, IconButton } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { LuCheck, LuX } from 'react-icons/lu'
import { subtleIconButtonStyles } from '#/styles/buttonStyles'
import {
  editableControlStyles,
  editableInputStyles,
  editablePreviewStyles,
  editableRootStyles,
} from '#/styles/editableStyles'

type EditableTextProps = {
  value: string
  onSubmit: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export default function EditableText({
  value,
  onSubmit,
  placeholder,
  disabled,
}: EditableTextProps) {
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    setDraft(value)
  }, [value])

  function handleValueCommit(details: Editable.ValueChangeDetails): void {
    const submitted = details.value.trim()

    if (submitted === '' || submitted === value) {
      setDraft(value)

      return
    }

    setDraft(submitted)
    onSubmit(submitted)
  }

  return (
    <Editable.Root
      value={draft}
      activationMode="click"
      placeholder={placeholder}
      disabled={disabled}
      css={editableRootStyles}
      onValueChange={(d) => setDraft(d.value)}
      onValueCommit={handleValueCommit}
    >
      <Editable.Preview css={editablePreviewStyles} />
      <Editable.Input css={editableInputStyles} />
      <Editable.Control css={editableControlStyles}>
        <Editable.SubmitTrigger asChild>
          <IconButton
            size="xs"
            variant="plain"
            aria-label="Confirm change"
            css={subtleIconButtonStyles}
          >
            <LuCheck />
          </IconButton>
        </Editable.SubmitTrigger>
        <Editable.CancelTrigger asChild>
          <IconButton
            size="xs"
            variant="plain"
            aria-label="Discard change"
            css={subtleIconButtonStyles}
          >
            <LuX />
          </IconButton>
        </Editable.CancelTrigger>
      </Editable.Control>
    </Editable.Root>
  )
}
