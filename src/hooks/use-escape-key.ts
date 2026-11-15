'use client'

import { useEffect, useEffectEvent } from 'react'

export function useEscapeKey(onEscape: () => void): void {
  const handleEscape = useEffectEvent(onEscape)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape' && !event.defaultPrevented && !event.isComposing) {
        handleEscape()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])
}
