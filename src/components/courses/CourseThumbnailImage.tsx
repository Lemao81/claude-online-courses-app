import { AspectRatio, Image } from '@chakra-ui/react'
import CourseThumbnailPlaceholder from '@/components/courses/CourseThumbnailPlaceholder'

type CourseThumbnailImageProps = {
  thumbnailUrl: string | null
  placeholder: string
}

export default function CourseThumbnailImage({
  thumbnailUrl,
  placeholder,
}: CourseThumbnailImageProps): React.JSX.Element {
  return (
    <AspectRatio ratio={16 / 9}>
      {thumbnailUrl ? (
        <Image src={thumbnailUrl} alt="Course thumbnail" objectFit="cover" borderRadius="card" />
      ) : (
        <CourseThumbnailPlaceholder text={placeholder} />
      )}
    </AspectRatio>
  )
}
