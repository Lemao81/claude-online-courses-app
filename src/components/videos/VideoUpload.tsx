import { Button, Flex, Stack } from '@chakra-ui/react'
import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { showErrorToast, showSuccessToast } from '#/components/ui/AppToaster'
import ErrorText from '#/components/ui/ErrorText'
import VideoDropZone from '#/components/videos/VideoDropZone'
import VideoFileList from '#/components/videos/VideoFileList'
import { createLesson } from '#/server/functions/lessons.functions'
import { completeVideoUpload, createVideoUploadUrl } from '#/server/functions/videos.functions'
import type { Lesson } from '#/types'
import {
  isVideoFile,
  probeVideoMetadata,
  toFileBaseName,
  toFileKey,
  uploadFile,
} from '#/utils/helpers'

type VideoUploadProps = {
  courseId: number
  chapterId?: number
  onAdded: (lesson: Lesson) => void
}

export default function VideoUpload({ courseId, chapterId, onAdded }: VideoUploadProps) {
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

  async function uploadVideo(file: File): Promise<Lesson> {
    const [target, metadata] = await Promise.all([
      createVideoUploadUrl({
        data: { courseId, fileName: file.name, contentType: file.type },
      }),
      probeVideoMetadata(file),
    ])

    await uploadFile(file, target.uploadUrl, target.contentType)
    const lesson = await createLesson({
      data: { courseId, chapterId, title: toFileBaseName(file.name) },
    })
    await completeVideoUpload({
      data: {
        courseId,
        lessonId: lesson.id,
        objectName: target.objectName,
        durationSec: metadata.durationSec,
        width: metadata.width,
        height: metadata.height,
      },
    })

    return lesson
  }

  async function handleUpload(): Promise<void> {
    setUploadError('')
    setIsUploading(true)
    const failed: File[] = []
    let firstLesson: Lesson | undefined
    let firstError = ''
    for (const file of files) {
      try {
        const lesson = await uploadVideo(file)
        firstLesson ??= lesson
      } catch (error) {
        console.error(error)
        failed.push(file)
        if (firstError === '') {
          firstError = error instanceof Error ? error.message : `Failed to upload ${file.name}`
        }
      }
    }

    const uploaded = files.length - failed.length

    setFiles(failed)
    setUploadError(firstError)
    setIsUploading(false)
    if (!firstLesson) {
      showErrorToast('No video was uploaded', firstError)

      return
    }

    onAdded(firstLesson)
    showSuccessToast(`${uploaded} ${uploaded === 1 ? 'video' : 'videos'} uploaded`)
    await router.invalidate()
  }

  return (
    <Stack gap="3">
      <VideoDropZone onFilesSelected={addFiles} />
      {files.length > 0 && (
        <Stack gap="2">
          <VideoFileList files={files} onRemove={handleRemove} />
          <ErrorText message={uploadError} />
          <Flex justify="flex-end">
            <Button type="button" variant="primary" loading={isUploading} onClick={handleUpload}>
              Upload
            </Button>
          </Flex>
        </Stack>
      )}
    </Stack>
  )
}
