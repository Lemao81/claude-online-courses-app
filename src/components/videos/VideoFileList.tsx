import { CloseButton, Flex, Stack, Text } from '@chakra-ui/react'
import { formatFileSize, toFileKey } from '#/utils/helpers'
import {
  fileNameStyles,
  fileRemoveButtonStyles,
  fileRowStyles,
  fileSizeStyles,
} from '#/utils/styles/videoUploadStyles'

type VideoFileListProps = {
  files: File[]
  onRemove: (key: string) => void
}

export default function VideoFileList({ files, onRemove }: VideoFileListProps) {
  return (
    <Stack gap="2">
      {files.map((file) => {
        const key = toFileKey(file)

        return (
          <Flex key={key} align="center" justify="space-between" gap="3" css={fileRowStyles}>
            <Stack gap="0.5" minW="0">
              <Text css={fileNameStyles}>{file.name}</Text>
              <Text css={fileSizeStyles}>{formatFileSize(file.size)}</Text>
            </Stack>
            <CloseButton
              size="sm"
              variant="plain"
              aria-label={`Remove ${file.name}`}
              css={fileRemoveButtonStyles}
              onClick={() => onRemove(key)}
            />
          </Flex>
        )
      })}
    </Stack>
  )
}
