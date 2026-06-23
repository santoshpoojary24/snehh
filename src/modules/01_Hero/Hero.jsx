import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HERO } from '../../config/content'
import SwipeHint from '../../components/ui/SwipeHint'
import { useApp } from '../../context/AppContext'

const NICKNAME_COLORS = ['#b45309', '#9f1239', '#27272a']

export default function HeroSection() {
  const [nickIdx, setNickIdx] = useState(0)
  const [eggCount, setEggCount] = useState(0)
  const { unlockEgg } = useApp()
  const eggTimerRef = useRef(null)

  useEffect(() => {
    const nicknames = HERO.nicknames
    if (nickIdx >= nicknames.length - 1) return
    const t = setTimeout(() => {
      setNickIdx(i => Math.min(i + 1, nicknames.length - 1))
    }, 2500)
    return () => clearTimeout(t)
  }, [nickIdx])

  const handleNicknameTap = () => {
    if (nickIdx !== HERO.nicknames.length - 1) return 
    setEggCount(c => {
      const next = c + 1
      if (next >= 5) {
        unlockEgg()
        return 0
      }
      clearTimeout(eggTimerRef.current)
      eggTimerRef.current = setTimeout(() => setEggCount(0), 3000)
      return next
    })
  }

  return (
    <section
      className="section"
      id="hero"
      data-section-index="0"
      style={{ position: 'relative', zIndex: 1 }}
    >
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '0 36px',
        gap: 16,
      }}>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 54,
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'var(--text-main)',
            lineHeight: 1,
            marginBottom: -4,
          }}
        >
          hey,
        </motion.h1>

        {/* Cinematic Nicknames */}
        <div style={{ minHeight: 70, position: 'relative', width: '100%' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={nickIdx}
              initial={{ opacity: 0, y: 15, filter: 'blur(8px)', scale: 0.95 }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, y: -15, filter: 'blur(8px)', scale: 1.05 }}
              transition={{ duration: 1.4, ease: [0.25, 1, 0.5, 1] }}
              onClick={handleNicknameTap}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 48,
                fontWeight: 600,
                color: NICKNAME_COLORS[nickIdx],
                cursor: 'pointer',
                lineHeight: 1.2,
                position: 'absolute',
                top: 0,
                left: 0,
                background: `linear-gradient(135deg, ${NICKNAME_COLORS[nickIdx]}, #000)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 10px 30px rgba(0,0,0,0.1)',
              }}
            >
              {HERO.nicknames[nickIdx]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Romantic Subline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 1.2, ease: 'easeOut' }}
          style={{ marginTop: 12, maxWidth: 280 }}
        >
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 16,
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            fontWeight: 300,
          }}>
            {HERO.subline}
          </p>
          <p style={{ 
            fontFamily: 'var(--font-hand)', 
            fontSize: 22, 
            color: 'var(--accent-amber)',
            marginTop: 12,
            opacity: 0.9,
          }}>
            {HERO.body}
          </p>
        </motion.div>

        {/* Premium CTA button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.5, duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          style={{ width: '100%', marginTop: 32 }}
        >
          <button
            className="btn-primary"
            onClick={() => {
              const next = document.querySelector('[data-section-index="1"]')
              next?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            {HERO.cta}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4 }}>
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </motion.div>

        {/* Ethereal Sticky Note */}
        <motion.div
          initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 4, scale: 1 }}
          transition={{ delay: 3.5, duration: 1.5, type: 'spring', bounce: 0.4 }}
          style={{
            marginTop: 40,
            alignSelf: 'flex-end',
            padding: '16px 20px',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,255,255,0.4))',
            borderRadius: 8,
            boxShadow: '0 8px 32px rgba(136,19,55,0.08), inset 0 0 0 1px rgba(255,255,255,0.5)',
            backdropFilter: 'blur(10px)',
            maxWidth: 160,
          }}
        >
          <p style={{
            fontFamily: 'var(--font-hand)',
            fontSize: 18,
            color: 'var(--accent-crimson)',
            lineHeight: 1.3,
            opacity: 0.8,
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
