import { Button, Flex, Stack, Text } from '@chakra-ui/react'
import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import VideoDropZone from '#/components/videos/VideoDropZone'
import VideoFileList from '#/components/videos/VideoFileList'
import { completeVideoUpload, createVideoUploadUrl } from '#/server/functions/videos.functions'
import {
  isVideoFile,
  probeVideoMetadata,
  toFileBaseName,
  toFileKey,
  uploadFile,
} from '#/utils/helpers'
import { primaryButtonStyles } from '#/utils/styles/buttonStyles'
import { formErrorStyles } from '#/utils/styles/formStyles'

type VideoUploadProps = {
  courseId: number
  chapterId: number
}

export default function VideoUpload({ courseId, chapterId }: VideoUploadProps) {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

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

  async function uploadVideo(file: File): Promise<void> {
    const [target, metadata] = await Promise.all([
      createVideoUploadUrl({
        data: { courseId, fileName: file.name, contentType: file.type },
      }),
      probeVideoMetadata(file),
    ])

    await uploadFile(file, target.uploadUrl, target.contentType)
    await completeVideoUpload({
      data: {
        courseId,
        chapterId,
        objectName: target.objectName,
        title: toFileBaseName(file.name),
        durationSec: metadata.durationSec,
        width: metadata.width,
        height: metadata.height,
      },
    })
  }

  async function handleUpload(): Promise<void> {
    setUploadError('')
    setIsUploading(true)
    const failed: File[] = []
    let firstError = ''
    for (const file of files) {
      try {
        await uploadVideo(file)
      } catch (error) {
        console.error(error)
        failed.push(file)
        if (firstError === '') {
          firstError = error instanceof Error ? error.message : `Failed to upload ${file.name}`
        }
      }
    }

    setFiles(failed)
    setUploadError(firstError)
    setIsUploading(false)
    if (failed.length < files.length) {
      await router.invalidate()
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
              loading={isUploading}
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
