import { Box, useRecipe } from '@chakra-ui/react'
import type { ReactNode } from 'react'

type IconTileProps = {
  size?: 'sm' | 'lg'
  children: ReactNode
}

export default function IconTile({ size, children }: IconTileProps) {
  const recipe = useRecipe({ key: 'iconTile' })

  return (
    <Box css={recipe({ size })} aria-hidden="true">
      {children}
    </Box>
  )
}
