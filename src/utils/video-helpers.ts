import { videoDurationProbeSeekSec, videoDurationProbeTimeoutMs } from '@/constants/config'
import { createVideoUploadUrl } from '@/server/functions/videos-functions'
import type { UploadedVideo, VideoMetadata } from '@/types'
import { uploadFile } from '@/utils/helpers'

const videoExtensions = ['.mp4', '.m4v', '.mov', '.webm', '.mkv', '.avi', '.mpg', '.mpeg']

export function isVideoFile(file: File): boolean {
  if (file.type !== '') {
    return file.type.startsWith('video/')
  }

  const name = file.name.toLowerCase()

  return videoExtensions.some((e) => name.endsWith(e))
}

export function probeVideoMetadata(file: File): Promise<VideoMetadata> {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    const objectUrl = URL.createObjectURL(file)
    const timeoutId = setTimeout(() => finish(0), videoDurationProbeTimeoutMs)

    function finish(duration: number): void {
      const metadata: VideoMetadata = {
        durationSec: Number.isFinite(duration) && duration > 0 ? Math.round(duration) : 0,
        width: video.videoWidth,
        height: video.videoHeight,
      }

      clearTimeout(timeoutId)
      video.onloadedmetadata = null
      video.ondurationchange = null
      video.onseeked = null
      video.onerror = null
      video.removeAttribute('src')
      video.load()
      URL.revokeObjectURL(objectUrl)
      resolve(metadata)
    }

    video.onloadedmetadata = () => {
      if (video.duration === Number.POSITIVE_INFINITY) {
        video.ondurationchange = () => finish(video.duration)
        video.onseeked = () => finish(video.duration)
        video.currentTime = videoDurationProbeSeekSec

        return
      }

      finish(video.duration)
    }

    video.onerror = () => finish(0)
    video.preload = 'metadata'
    video.muted = true
    video.src = objectUrl
  })
}

export async function uploadVideoFile(courseId: number, file: File): Promise<UploadedVideo> {
  const [target, metadata] = await Promise.all([
    createVideoUploadUrl({
      data: { courseId, fileName: file.name, contentType: file.type },
    }),
    probeVideoMetadata(file),
  ])

  await uploadFile(file, target.uploadUrl, target.contentType)

  return { objectName: target.objectName, ...metadata }
}
