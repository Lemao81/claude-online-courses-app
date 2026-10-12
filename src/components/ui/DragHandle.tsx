import { IconButton } from '@chakra-ui/react'
import { LuGripVertical } from 'react-icons/lu'

type DragHandleProps = {
  label: string
  ref: (element: Element | null) => void
}

export default function DragHandle({ label, ref }: DragHandleProps): React.JSX.Element {
  return (
    <IconButton ref={ref} size="sm" variant="grip" aria-label={label}>
      <LuGripVertical aria-hidden="true" />
    </IconButton>
  )
}
