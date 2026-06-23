import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SwipeHint() {
  const [visible, setVisible] = useState(
    () => sessionStorage.getItem('swiped') !== 'true'
  )

  useEffect(() => {
    const onScroll = () => {
      sessionStorage.setItem('swiped', 'true')
      setVisible(false)
    }
    window.addEventListener('scroll', onScroll, { once: true, passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -10] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 0.5 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            pointerEvents: 'none',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-hand)',
            fontSize: 14,
            color: 'var(--ink-dark)',
            opacity: 0.5,
          }}>
            swipe up 👆
          </span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <path d="M8 2L8 22M2 16L8 22L14 16" stroke="var(--ink-dark)" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
