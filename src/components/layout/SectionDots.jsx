import React from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'

const SECTION_LABELS = ['hero', 'photos', 'timeline', 'jokes', 'love', 'gift', 'game', 'letter', 'egg']

export default function SectionDots() {
  const { activeSection } = useApp()

  return (
    <div style={{
      position: 'fixed',
      right: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      zIndex: 100,
      alignItems: 'center',
    }}>
      {SECTION_LABELS.map((label, i) => (
        <motion.div
          key={label}
          title={label}
          animate={{
            scale: activeSection === i ? 1.4 : 1,
            backgroundColor: activeSection === i ? 'var(--saffron)' : 'rgba(28,25,23,0.2)',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            cursor: 'pointer',
          }}
          onClick={() => {
            const el = document.querySelector(`[data-section-index="${i}"]`)
            el?.scrollIntoView({ behavior: 'smooth' })
          }}
        />
      ))}
    </div>
  )
}
