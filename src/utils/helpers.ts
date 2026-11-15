import { thumbnailContentTypes } from '@/constants'

export function isThumbnailContentType(contentType: string): boolean {
  return thumbnailContentTypes.some((t) => t === contentType)
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

export function revealElement(id: string): void {
  const element = document.getElementById(id)
  if (!element) {
    return
  }

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  element.scrollIntoView({ behavior: isReducedMotion ? 'auto' : 'smooth', block: 'center' })
  element.focus({ preventScroll: true })
}
