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
