import React from 'react'
import { motion } from 'framer-motion'

const COLORS = {
  yellow: '#FEF9C3',
  pink: '#FCE7F3',
  green: '#DCFCE7',
  lavender: '#EDE9FE',
  cream: '#FFF8F0',
}

export default function StickyCard({
  children,
  rotation = -3,
  color = 'cream',
  className = '',
  style = {},
  ...props
}) {
  const bg = COLORS[color] || COLORS.cream

  return (
    <motion.div
      className={`sticky-card ${className}`}
      style={{
        background: bg,
        borderRadius: 10,
        padding: '14px 16px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
        rotate: rotation,
        cursor: 'pointer',
        position: 'relative',
        ...style,
      }}
      whileTap={{ scale: 1.04, rotate: 0, boxShadow: '0 12px 32px rgba(0,0,0,0.18)' }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
