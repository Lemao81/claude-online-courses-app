'use client'

import { type RefObject, useEffect, useRef } from 'react'

export function useHeightVariable<T extends HTMLElement>(name: string): RefObject<T | null> {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) {
      return
    }

    const root = document.documentElement
    const observer = new ResizeObserver(([entry]) => {
      root.style.setProperty(name, `${entry.borderBoxSize[0].blockSize}px`)
    })

    observer.observe(element)

    return () => {
      observer.disconnect()
      root.style.removeProperty(name)
    }
  }, [name])

  return ref
}
