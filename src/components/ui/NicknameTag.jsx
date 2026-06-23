import React from 'react'
import { motion } from 'framer-motion'

const COLOR_MAP = {
  saffron: { bg: 'var(--saffron)', text: 'var(--ink-dark)' },
  pink: { bg: 'var(--rasmalai-pink)', text: '#fff' },
  green: { bg: 'var(--pistachio)', text: 'var(--ink-dark)' },
  purple: { bg: 'var(--chirkutt-purple)', text: '#fff' },
}

export default function NicknameTag({ label, color = 'saffron', style = {} }) {
  const { bg, text } = COLOR_MAP[color] || COLOR_MAP.saffron
  return (
    <motion.span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 14px',
        borderRadius: 999,
        background: bg,
        color: text,
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 15,
        ...style,
      }}
      whileTap={{ scale: 0.95 }}
    >
      {label}
    </motion.span>
  )
}
