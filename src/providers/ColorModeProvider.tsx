'use client'

import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'

export default function ColorModeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange>
      {children}
    </ThemeProvider>
  )
}
