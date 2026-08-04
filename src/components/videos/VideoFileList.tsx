import { CloseButton, Flex, Stack, Text } from '@chakra-ui/react'
import { formatFileSize } from '#/utils/formatters'
import { toFileKey } from '#/utils/helpers'
import { subtleIconButtonStyles } from '#/utils/styles/buttonStyles'
import { rowStyles } from '#/utils/styles/surfaceStyles'
import { metaStyles } from '#/utils/styles/textStyles'
import { fileNameStyles } from '#/utils/styles/videoUploadStyles'

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
          <Flex key={key} align="center" justify="space-between" gap="3" css={rowStyles}>
            <Stack gap="0.5" minW="0">
              <Text css={fileNameStyles}>{file.name}</Text>
              <Text css={metaStyles}>{formatFileSize(file.size)}</Text>
            </Stack>
            <CloseButton
              size="sm"
              variant="plain"
              aria-label={`Remove ${file.name}`}
              css={subtleIconButtonStyles}
              onClick={() => onRemove(key)}
            />
          </Flex>
        )
      })}
    </Stack>
  )
}
