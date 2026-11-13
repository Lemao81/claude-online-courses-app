import { Button, Flex, Stack, Text } from '@chakra-ui/react'
import { useRouter } from '@tanstack/react-router'
import { type ChangeEvent, useRef, useState } from 'react'
import { LuImageUp } from 'react-icons/lu'
import CourseThumbnailImage from '@/components/courses/CourseThumbnailImage'
import ErrorText from '@/components/ui/ErrorText'
import { thumbnailContentTypes } from '@/constants'
import { maxThumbnailSizeBytes } from '@/constants/config'
import { thumbnailSizeMessage, thumbnailTypeMessage } from '@/constants/error-messages'
import {
  completeThumbnailUpload,
  createThumbnailUploadUrl,
} from '@/server/functions/thumbnails-functions'
import { isThumbnailContentType, uploadFile } from '@/utils/helpers'

type CourseThumbnailProps = {
  courseId: number
  thumbnailUrl: string | null
}

function getFileError(file: File): string {
  if (!isThumbnailContentType(file.type)) {
    return thumbnailTypeMessage
  }

  if (file.size > maxThumbnailSizeBytes) {
    return thumbnailSizeMessage
  }

  return ''
}

export default function CourseThumbnail({
  courseId,
  thumbnailUrl,
}: CourseThumbnailProps): React.JSX.Element {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  async function uploadThumbnail(file: File): Promise<void> {
    const target = await createThumbnailUploadUrl({
      data: { courseId, fileName: file.name, contentType: file.type, sizeBytes: file.size },
    })

    await uploadFile(file, target.uploadUrl, target.contentType)
    await completeThumbnailUpload({ data: { courseId, objectName: target.objectName } })
  }

  async function handleInputChange(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) {
      return
    }

    const fileError = getFileError(file)
    setUploadError(fileError)
    if (fileError !== '') {
      return
    }

    setIsUploading(true)
    try {
      await uploadThumbnail(file)
    } catch (error) {
      console.error(error)
      setUploadError(error instanceof Error ? error.message : 'Failed to upload the thumbnail')
      setIsUploading(false)

      return
    }

    await router.invalidate()
    setIsUploading(false)
  }

  return (
    <Stack gap="2" maxW="24rem">
      <Text textStyle="sectionLabel">Thumbnail</Text>
      <CourseThumbnailImage
        thumbnailUrl={thumbnailUrl}
        placeholder="JPEG, PNG or WebP, up to 5 MB"
      />
      <Flex justify="flex-start">
        <Button
          type="button"
          variant="chip"
          loading={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          <LuImageUp aria-hidden="true" />
          {thumbnailUrl ? 'Replace' : 'Upload thumbnail'}
        </Button>
      </Flex>
      <ErrorText message={uploadError} />
      <input
        ref={inputRef}
        type="file"
        accept={thumbnailContentTypes.join(',')}
        hidden
        onChange={handleInputChange}
      />
    </Stack>
  )
}
