import { Button, CloseButton, Dialog, Portal, Stack, Text } from '@chakra-ui/react'
import { type ReactNode, useState } from 'react'
import ErrorText from '#/components/ui/ErrorText'
import {
  primaryButtonStyles,
  secondaryButtonStyles,
  subtleIconButtonStyles,
} from '#/utils/styles/buttonStyles'
import {
  dialogBackdropStyles,
  dialogContentStyles,
  dialogQuestionStyles,
  dialogTitleStyles,
} from '#/utils/styles/formStyles'
import { subtitleStyles } from '#/utils/styles/textStyles'

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
        <Dialog.Backdrop css={dialogBackdropStyles} />
        <Dialog.Positioner>
          <Dialog.Content css={dialogContentStyles}>
            <Dialog.Header>
              <Dialog.Title css={dialogTitleStyles}>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack gap="2">
                <Dialog.Description css={dialogQuestionStyles}>{question}</Dialog.Description>
                {description && <Text css={subtitleStyles}>{description}</Text>}
                <ErrorText message={confirmError} />
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button
                  type="button"
                  variant="plain"
                  disabled={isConfirming}
                  css={secondaryButtonStyles}
                >
                  {cancelLabel}
                </Button>
              </Dialog.ActionTrigger>
              <Button
                type="button"
                variant="plain"
                loading={isConfirming}
                onClick={handleConfirm}
                css={primaryButtonStyles}
              >
                {confirmLabel}
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton
                size="sm"
                variant="plain"
                disabled={isConfirming}
                css={subtleIconButtonStyles}
              />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
