import { Box, Button, Flex, Text } from '@chakra-ui/react'
import { type ChangeEvent, type DragEvent, useRef, useState } from 'react'
import { LuCloudUpload, LuFolderOpen } from 'react-icons/lu'
import { secondaryButtonStyles } from '#/utils/styles/buttonStyles'
import { subtitleStyles, titleStyles } from '#/utils/styles/textStyles'
import {
  dropZoneActiveStyles,
  dropZoneIconStyles,
  dropZoneStyles,
} from '#/utils/styles/videoUploadStyles'

type VideoDropZoneProps = {
  onFilesSelected: (files: File[]) => void
}

export default function VideoDropZone({ onFilesSelected }: VideoDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const dragDepth = useRef(0)
  const [isDragActive, setIsDragActive] = useState(false)

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
    onFilesSelected(Array.from(event.dataTransfer.files))
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    onFilesSelected(Array.from(event.target.files ?? []))
    event.target.value = ''
  }

  function handleSelectClick(): void {
    inputRef.current?.click()
  }

  return (
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
        <Text css={titleStyles}>Drop your videos here</Text>
        <Text css={subtitleStyles}>MP4, MOV or WebM — or pick them from your device</Text>
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
  )
}
