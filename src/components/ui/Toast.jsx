import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'

export default function Toast() {
  const { toastMsg } = useApp()

  return (
    <AnimatePresence>
      {toastMsg && (
        <motion.div
          key={toastMsg}
          initial={{ y: 80, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={{
            position: 'fixed',
            bottom: 'calc(80px + env(safe-area-inset-bottom, 16px))',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--ink-dark)',
            color: '#fff',
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            fontWeight: 500,
            padding: '10px 20px',
            borderRadius: 999,
            zIndex: 300,
            whiteSpace: 'nowrap',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            pointerEvents: 'none',
          }}
        >
          {toastMsg}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
