import { Box, Button, Flex, Stack, Text } from '@chakra-ui/react'
import { type ChangeEvent, type DragEvent, useRef, useState } from 'react'
import { LuCloudUpload, LuFolderOpen } from 'react-icons/lu'
import VideoFileList from '#/components/videos/VideoFileList'
import { isVideoFile, toFileKey } from '#/utils/helpers'
import { primaryButtonStyles, secondaryButtonStyles } from '#/utils/styles/buttonStyles'
import {
  dropZoneActiveStyles,
  dropZoneHintStyles,
  dropZoneIconStyles,
  dropZoneStyles,
  dropZoneTitleStyles,
} from '#/utils/styles/videoUploadStyles'

export default function VideoUpload() {
  const inputRef = useRef<HTMLInputElement>(null)
  const dragDepth = useRef(0)
  const [isDragActive, setIsDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  function addFiles(candidates: File[]): void {
    const videos = candidates.filter(isVideoFile)
    if (videos.length === 0) {
      return
    }

    setFiles((current) => {
      const keys = new Set(current.map(toFileKey))

      return [...current, ...videos.filter((video) => !keys.has(toFileKey(video)))]
    })
  }

  function handleDragEnter(event: DragEvent<HTMLDivElement>): void {
    event.preventDefault()
    dragDepth.current += 1
    setIsDragActive(true)
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>): void {
    event.preventDefault()
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>): void {
    event.preventDefault()
    dragDepth.current -= 1
    if (dragDepth.current <= 0) {
      dragDepth.current = 0
      setIsDragActive(false)
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>): void {
    event.preventDefault()
    dragDepth.current = 0
    setIsDragActive(false)
    addFiles(Array.from(event.dataTransfer.files))
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    addFiles(Array.from(event.target.files ?? []))
    event.target.value = ''
  }

  function handleSelectClick(): void {
    inputRef.current?.click()
  }

  function handleRemove(key: string): void {
    setFiles((current) => current.filter((file) => toFileKey(file) !== key))
  }

  function handleUpload(): void {
    return
  }

  return (
    <Stack gap="3">
      <Box
        css={isDragActive ? { ...dropZoneStyles, ...dropZoneActiveStyles } : dropZoneStyles}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Flex direction="column" align="center" gap="3">
          <Box css={dropZoneIconStyles} aria-hidden="true">
            <LuCloudUpload size={22} />
          </Box>
          <Text css={dropZoneTitleStyles}>Drop your videos here</Text>
          <Text css={dropZoneHintStyles}>MP4, MOV or WebM — or pick them from your device</Text>
          <Button
            type="button"
            variant="plain"
            css={secondaryButtonStyles}
            onClick={handleSelectClick}
          >
            <LuFolderOpen aria-hidden="true" />
            Select Videos
          </Button>
        </Flex>
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          multiple
          hidden
          onChange={handleInputChange}
        />
      </Box>
      {files.length > 0 && (
        <Stack gap="2">
          <VideoFileList files={files} onRemove={handleRemove} />
          <Flex justify="flex-end">
            <Button type="button" variant="plain" css={primaryButtonStyles} onClick={handleUpload}>
              Upload
            </Button>
          </Flex>
        </Stack>
      )}
    </Stack>
  )
}
