import { Editable, IconButton } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { LuCheck, LuX } from 'react-icons/lu'

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
      onValueChange={(d) => setDraft(d.value)}
      onValueCommit={handleValueCommit}
    >
      <Editable.Preview />
      <Editable.Input />
      <Editable.Control>
        <Editable.SubmitTrigger asChild>
          <IconButton size="xs" variant="quiet" aria-label="Confirm change">
            <LuCheck />
          </IconButton>
        </Editable.SubmitTrigger>
        <Editable.CancelTrigger asChild>
          <IconButton size="xs" variant="quiet" aria-label="Discard change">
            <LuX />
          </IconButton>
        </Editable.CancelTrigger>
      </Editable.Control>
    </Editable.Root>
  )
}
