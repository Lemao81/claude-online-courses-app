import { Button, Flex, Stack, Text } from '@chakra-ui/react'
import { useRef, useState } from 'react'
import VideoDropZone from '#/components/videos/VideoDropZone'
import VideoFileList from '#/components/videos/VideoFileList'
import { createVideoUploadUrl } from '#/server/functions/videos.functions'
import { isVideoFile, toFileKey } from '#/utils/helpers'
import { primaryButtonStyles } from '#/utils/styles/buttonStyles'
import { formErrorStyles } from '#/utils/styles/formStyles'
import type { VideoUploadTarget } from '#/utils/types'

type VideoUploadProps = {
  courseId: number
}

export default function VideoUpload({ courseId }: VideoUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isPreparing, setIsPreparing] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const uploadTargets = useRef(new Map<string, VideoUploadTarget>())

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
    uploadTargets.current.delete(key)
    setFiles((c) => c.filter((f) => toFileKey(f) !== key))
  }

  async function handleUpload(): Promise<void> {
    setUploadError('')
    setIsPreparing(true)
    try {
      const targets = await Promise.all(
        files.map((file) =>
          createVideoUploadUrl({
            data: { courseId, fileName: file.name, contentType: file.type },
          }),
        ),
      )

      files.forEach((file, index) => {
        uploadTargets.current.set(toFileKey(file), targets[index])
      })

      console.log(targets.map((t) => t.uploadUrl))
    } catch (error) {
      console.error(error)
      setUploadError(error instanceof Error ? error.message : 'Failed to prepare the video upload')
    } finally {
      setIsPreparing(false)
    }
  }

  return (
    <Stack gap="3">
      <VideoDropZone onFilesSelected={addFiles} />
      {files.length > 0 && (
        <Stack gap="2">
          <VideoFileList files={files} onRemove={handleRemove} />
          {uploadError !== '' && (
            <Text css={formErrorStyles} role="alert">
              {uploadError}
            </Text>
          )}
          <Flex justify="flex-end">
            <Button
              type="button"
              variant="plain"
              css={primaryButtonStyles}
              loading={isPreparing}
              onClick={handleUpload}
            >
              Upload
            </Button>
          </Flex>
        </Stack>
      )}
    </Stack>
  )
}
