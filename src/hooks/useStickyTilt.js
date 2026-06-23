import { useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useCallback } from 'react'

export function useStickyTilt() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-50, 50], [8, -8]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(x, [-50, 50], [-8, 8]), { stiffness: 200, damping: 20 })

  const onTap = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = e.clientX - rect.left - rect.width / 2
    const cy = e.clientY - rect.top - rect.height / 2
    x.set(cx)
    y.set(cy)
    setTimeout(() => { x.set(0); y.set(0) }, 400)
  }, [x, y])

  return { rotateX, rotateY, onTap }
}
