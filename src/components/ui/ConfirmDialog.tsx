import { Button, CloseButton, Dialog, Portal, Stack, Text } from '@chakra-ui/react'
import { type ReactNode, useState } from 'react'
import ErrorText from '#/components/ui/ErrorText'

type ConfirmDialogProps = {
  question: string
  title?: string
  description?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void | Promise<void>
}

export default function ConfirmDialog({
  question,
  title = 'Confirm',
  description,
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  open,
  onOpenChange,
  onConfirm,
}: ConfirmDialogProps) {
  const [isConfirming, setIsConfirming] = useState(false)
  const [confirmError, setConfirmError] = useState('')

  function changeOpen(nextOpen: boolean): void {
    onOpenChange(nextOpen)
    if (!nextOpen) {
      setConfirmError('')
    }
  }

  function handleOpenChange(nextOpen: boolean): void {
    if (isConfirming) {
      return
    }

    changeOpen(nextOpen)
  }

  async function handleConfirm(): Promise<void> {
    setConfirmError('')
    setIsConfirming(true)
    try {
      await onConfirm()
    } catch (error) {
      console.error(error)
      setIsConfirming(false)
      setConfirmError(error instanceof Error ? error.message : 'The action failed')

      return
    }

    setIsConfirming(false)
    changeOpen(false)
  }

  return (
    <Dialog.Root
      role="alertdialog"
      placement="center"
      open={open}
      onOpenChange={(d) => handleOpenChange(d.open)}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack gap="2">
                <Dialog.Description>{question}</Dialog.Description>
                {description && <Text textStyle="subtitle">{description}</Text>}
                <ErrorText message={confirmError} />
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isConfirming}
                >
                  {cancelLabel}
                </Button>
              </Dialog.ActionTrigger>
              <Button
                type="button"
                variant="primary"
                loading={isConfirming}
                onClick={handleConfirm}
              >
                {confirmLabel}
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton
                size="sm"
                variant="quiet"
                disabled={isConfirming}
              />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
