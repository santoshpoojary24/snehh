import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HERO } from '../../config/content'
import SwipeHint from '../../components/ui/SwipeHint'
import { useApp } from '../../context/AppContext'

const NICKNAMES = ['Sneha 🌹', 'My Favourite Person ✨', 'Snehhh ❤️']
const COLORS = ['#9f1239', '#b45309', '#1C1917']

export default function HeroSection() {
  const [nickIdx, setNickIdx] = useState(0)
  const [eggCount, setEggCount] = useState(0)
  const { unlockEgg } = useApp()
  const eggTimerRef = useRef(null)

  useEffect(() => {
    if (nickIdx >= NICKNAMES.length - 1) return
    const t = setTimeout(() => setNickIdx(i => i + 1), 2600)
    return () => clearTimeout(t)
  }, [nickIdx])

  const handleNicknameTap = () => {
    if (nickIdx !== NICKNAMES.length - 1) return
    setEggCount(c => {
      const next = c + 1
      if (next >= 5) { unlockEgg(); return 0 }
      clearTimeout(eggTimerRef.current)
      eggTimerRef.current = setTimeout(() => setEggCount(0), 3000)
      return next
    })
  }

  return (
    <section className="section" id="hero" data-section-index="0" style={{ position: 'relative', zIndex: 1 }}>

      {/* Subtle decorative corner accent */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 160, height: 160,
        background: 'radial-gradient(circle at top right, rgba(139,21,53,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: 80, left: -20,
        width: 120, height: 120,
        background: 'radial-gradient(circle, rgba(194,130,10,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '0 36px',
        gap: 12,
      }}>

        {/* Greeting label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9, ease: 'easeOut' }}
          style={{
            fontFamily: 'var(--font-hand)',
            fontSize: 20,
            color: 'var(--accent-crimson)',
            opacity: 0.75,
            letterSpacing: '0.02em',
          }}
        >
          a love letter to
        </motion.p>

        <motion.h1
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.55, duration: 1, ease: [0.25, 1, 0.5, 1] }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 52,
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'var(--text-main)',
            lineHeight: 1.05,
          }}
        >
          hey,
        </motion.h1>

        {/* Nicknames — no blur filter (causes lag) */}
        <div style={{ minHeight: 68, position: 'relative', width: '100%' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={nickIdx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
              onClick={handleNicknameTap}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 44,
                fontWeight: 700,
                color: COLORS[nickIdx],
                cursor: 'pointer',
                lineHeight: 1.2,
                position: 'absolute',
                top: 0, left: 0,
                letterSpacing: '-0.01em',
              }}
            >
              {NICKNAMES[nickIdx]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Divider line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.6, duration: 1.2, ease: 'easeInOut' }}
          style={{
            width: 48, height: 1.5,
            background: 'linear-gradient(90deg, var(--accent-crimson), transparent)',
            transformOrigin: 'left',
            marginTop: 4,
          }}
        />

        {/* Subline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 1, ease: 'easeOut' }}
          style={{ maxWidth: 300, marginTop: 4 }}
        >
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            color: 'var(--text-muted)',
            lineHeight: 1.65,
            fontWeight: 300,
          }}>
            {HERO.subline}
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.0, duration: 1, ease: [0.25, 1, 0.5, 1] }}
          style={{ width: '100%', marginTop: 24 }}
        >
          <button
            className="btn-primary"
            onClick={() => {
              const next = document.querySelector('[data-section-index="1"]')
              next?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            {HERO.cta}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </motion.div>

        {/* Sticky note */}
        <motion.div
          initial={{ opacity: 0, rotate: -8, scale: 0.85 }}
          animate={{ opacity: 1, rotate: 3, scale: 1 }}
          transition={{ delay: 2.8, duration: 1.2, type: 'spring', bounce: 0.35 }}
          style={{
            marginTop: 28,
            alignSelf: 'flex-end',
            padding: '14px 18px',
            background: 'rgba(255,255,255,0.88)',
            borderRadius: 10,
            boxShadow: '0 4px 20px rgba(139,21,53,0.07), 0 1px 0 rgba(255,255,255,0.9) inset',
            border: '1px solid rgba(139,21,53,0.06)',
            maxWidth: 155,
          }}
        >
          <p style={{
            fontFamily: 'var(--font-hand)',
            fontSize: 17,
            color: 'var(--accent-crimson)',
            lineHeight: 1.35,
            opacity: 0.85,
            textAlign: 'center',
          }}>
            {HERO.stickyNote}
          </p>
        </motion.div>
      </div>

      <SwipeHint />
    </section>
  )
}
