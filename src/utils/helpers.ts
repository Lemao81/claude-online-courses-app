const sizeUnits = ['B', 'KB', 'MB', 'GB']
const videoExtensions = ['.mp4', '.m4v', '.mov', '.webm', '.mkv', '.avi', '.mpg', '.mpeg']

export function isVideoFile(file: File): boolean {
  if (file.type !== '') {
    return file.type.startsWith('video/')
  }

  const name = file.name.toLowerCase()

  return videoExtensions.some((extension) => name.endsWith(extension))
}

export function toFileKey(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`
}

export function formatFileSize(bytes: number): string {
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < sizeUnits.length - 1) {
    size /= 1024
    unitIndex += 1
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${sizeUnits[unitIndex]}`
}
