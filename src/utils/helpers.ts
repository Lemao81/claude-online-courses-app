import { videoDurationProbeSeekSec, videoDurationProbeTimeoutMs } from '#/config/constants'
import type { VideoMetadata } from '#/types'

const videoExtensions = ['.mp4', '.m4v', '.mov', '.webm', '.mkv', '.avi', '.mpg', '.mpeg']

export function isVideoFile(file: File): boolean {
  if (file.type !== '') {
    return file.type.startsWith('video/')
  }

  const name = file.name.toLowerCase()

  return videoExtensions.some((e) => name.endsWith(e))
}

export function toFileKey(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`
}

export function toFileExtension(fileName: string): string {
  const index = fileName.lastIndexOf('.')

  return index > 0 ? fileName.slice(index).toLowerCase() : ''
}

export function toFileBaseName(fileName: string): string {
  const index = fileName.lastIndexOf('.')

  return index > 0 ? fileName.slice(0, index) : fileName
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

export async function uploadFile(
  file: File,
  uploadUrl: string,
  contentType: string,
): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': contentType },
  })

  if (!response.ok) {
    throw new Error(`Upload of ${file.name} failed with status ${response.status}`)
  }
}
