'use client'

import { type Dispatch, type SetStateAction, useState } from 'react'

export function useSyncedState<T>(value: T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState(value)
  const [syncedValue, setSyncedValue] = useState(value)

  if (value !== syncedValue) {
    setSyncedValue(value)
    setState(value)
  }

  return [state, setState]
}
