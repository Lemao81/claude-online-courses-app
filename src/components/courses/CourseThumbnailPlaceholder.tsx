import { Flex, Text } from '@chakra-ui/react'
import { LuImage } from 'react-icons/lu'
import IconTile from '@/components/ui/IconTile'

type CourseThumbnailPlaceholderProps = {
  text: string
}

export default function CourseThumbnailPlaceholder({
  text,
}: CourseThumbnailPlaceholderProps): React.JSX.Element {
  return (
    <Flex direction="column" align="center" justify="center" gap="2" layerStyle="emptyStateCard">
      <IconTile>
        <LuImage size={16} />
      </IconTile>
      <Text textStyle="meta">{text}</Text>
    </Flex>
  )
}
