import { Button, Flex, Stack } from '@chakra-ui/react'
import { useState } from 'react'
import VideoDropZone from '#/components/videos/VideoDropZone'
import VideoFileList from '#/components/videos/VideoFileList'
import { isVideoFile, toFileKey } from '#/utils/helpers'
import { primaryButtonStyles } from '#/utils/styles/buttonStyles'

export default function VideoUpload() {
  const [files, setFiles] = useState<File[]>([])

  function addFiles(candidates: File[]): void {
    const videos = candidates.filter(isVideoFile)
    if (videos.length === 0) {
      return
    }

    setFiles((current) => {
      const keys = new Set(current.map(toFileKey))

      return [...current, ...videos.filter((v) => !keys.has(toFileKey(v)))]
    })
  }

  function handleRemove(key: string): void {
    setFiles((c) => c.filter((f) => toFileKey(f) !== key))
  }

  function handleUpload(): void {
    return
  }

  return (
    <Stack gap="3">
      <VideoDropZone onFilesSelected={addFiles} />
      {files.length > 0 && (
        <Stack gap="2">
          <VideoFileList files={files} onRemove={handleRemove} />
          <Flex justify="flex-end">
            <Button type="button" variant="plain" css={primaryButtonStyles} onClick={handleUpload}>
              Upload
            </Button>
          </Flex>
        </Stack>
      )}
    </Stack>
  )
}
