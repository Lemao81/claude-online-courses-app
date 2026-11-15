import { IconButton } from '@chakra-ui/react'
import { useRouter } from '@tanstack/react-router'
import { type ChangeEvent, useRef, useState } from 'react'
import { LuFileUp } from 'react-icons/lu'
import { showErrorToast, showSuccessToast } from '@/components/ui/AppToaster'
import Tooltip from '@/components/ui/Tooltip'
import { completeVideoUpload } from '@/server/functions/videos-functions'
import type { LessonVideo } from '@/types'
import { isVideoFile, uploadVideoFile } from '@/utils/video-helpers'

type LessonVideoButtonProps = {
  courseId: number
  lesson: LessonVideo
}

export default function LessonVideoButton({
  courseId,
  lesson,
}: LessonVideoButtonProps): React.JSX.Element {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const hasVideo = lesson.videoStatus !== null
  const label = hasVideo ? 'Replace video' : 'Upload video'

  async function uploadVideo(file: File): Promise<void> {
    const video = await uploadVideoFile(courseId, file)

    await completeVideoUpload({ data: { courseId, lessonId: lesson.id, ...video } })
  }

  async function handleInputChange(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) {
      return
    }

    if (!isVideoFile(file)) {
      showErrorToast('Not a video', `${file.name} is not a video file`)

      return
    }

    setIsUploading(true)
    try {
      await uploadVideo(file)
    } catch (error) {
      console.error(error)
      showErrorToast(
        hasVideo ? 'The video was not replaced' : 'The video was not uploaded',
        error instanceof Error ? error.message : undefined,
      )

      setIsUploading(false)

      return
    }

    showSuccessToast(hasVideo ? 'Video replaced' : 'Video uploaded')
    await router.invalidate()
    setIsUploading(false)
  }

  return (
    <>
      <Tooltip content={label} showArrow>
        <IconButton
          size="sm"
          variant="quiet"
          _icon={{ boxSize: '5' }}
          aria-label={`${label} of ${lesson.title}`}
          loading={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          <LuFileUp aria-hidden="true" />
        </IconButton>
      </Tooltip>
      <input ref={inputRef} type="file" accept="video/*" hidden onChange={handleInputChange} />
    </>
  )
}
