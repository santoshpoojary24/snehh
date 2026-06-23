import { useRef, useCallback } from 'react'
import { useApp } from '../context/AppContext'

export function useConfetti() {
  const { fireConfetti } = useApp()
  return fireConfetti
}
