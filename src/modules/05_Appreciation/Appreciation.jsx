import React, { useState, useRef, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { APPRECIATIONS } from '../../config/content'
import { useApp } from '../../context/AppContext'

// Upgraded premium heart burst effect
function HeartParticles({ active, origin }) {
  if (!active) return null
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', borderRadius: 16, zIndex: 10 }}>
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const distance = 40 + Math.random() * 40
        return (
          <motion.div
            key={i}
            initial={{ x: origin.x, y: origin.y, opacity: 1, scale: 0.2 }}
            animate={{
              x: origin.x + Math.cos(angle) * distance,
              y: origin.y + Math.sin(angle) * distance - 30,
              opacity: [1, 1, 0],
              scale: [0.2, 1.2, 0.8],
              rotate: (Math.random() - 0.5) * 60,
            }}
            transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
            style={{
              position: 'absolute',
              width: 14,
              height: 14,
              marginLeft: -7,
              marginTop: -7,
            }}
          >
            <svg viewBox="0 0 24 24" fill={i % 2 === 0 ? "url(#grad-red)" : "url(#grad-amber)"} stroke="none">
              <defs>
                <linearGradient id="grad-red" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#7f1d1d" />
                </linearGradient>
                <linearGradient id="grad-amber" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
              </defs>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </motion.div>
        )
      })}
    </div>
  )
}

export default function AppreciationSection() {
  const [seenCards, setSeenCards] = useState(() => {
    try { return JSON.parse(localStorage.getItem('seen_cards') || '[]') } catch { return [] }
  })
  const [activeParticle, setActiveParticle] = useState(null)
  const [particleOrigin, setParticleOrigin] = useState({ x: 140, y: 60 })
  const { fireConfetti, showToast } = useApp()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  const markSeen = useCallback((id, e) => {
    // Determine burst origin relative to the card
    const rect = e.currentTarget.getBoundingClientRect()
    const ox = e.clientX - rect.left
    const oy = e.clientY - rect.top
    setParticleOrigin({ x: ox, y: oy })
    setActiveParticle(id)
    setTimeout(() => setActiveParticle(null), 1200)

    const newSeen = seenCards.includes(id) ? seenCards : [...seenCards, id]
    setSeenCards(newSeen)
    localStorage.setItem('seen_cards', JSON.stringify(newSeen))

    if (newSeen.length >= APPRECIATIONS.length && !seenCards.includes(id)) {
      setTimeout(() => {
        fireConfetti('crimson')
        showToast('you are everything to me. ❤️')
      }, 600)
    }
  }, [seenCards, fireConfetti, showToast])

  return (
    <section className="section" id="appreciation" data-section-index="4" ref={ref}>
      
      {/* Soft romantic ambient background glow */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100vw',
          height: '50vh',
          background: 'radial-gradient(ellipse at center, rgba(127,29,29,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ padding: '20px 20px 8px', flexShrink: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <span className="section-label" style={{ padding: 0, lineHeight: 1.2 }}>
              things i adore<br />about you.
            </span>
            <p style={{
              fontFamily: 'var(--font-hand)',
              fontSize: 15,
              color: 'var(--text-main)',
              opacity: 0.5,
              marginTop: 6,
            }}>
              {seenCards.length === APPRECIATIONS.length 
                ? "and a million more things..." 
                : "swipe and tap to reveal my heart ✨"}
            </p>
          </motion.div>
        </div>

        {/* Progress / Dot indicator */}
        <div style={{ paddingLeft: 20, marginBottom: 12, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--accent-amber)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: 600,
          }}>
            {seenCards.length} / {APPRECIATIONS.length} cards
          </span>
          <div style={{ flex: 1, height: 2, background: 'rgba(127,29,29,0.1)', borderRadius: 2, marginRight: 20 }}>
            <motion.div 
              style={{ height: '100%', background: 'var(--accent-crimson)', borderRadius: 2 }}
              animate={{ width: `${(seenCards.length / APPRECIATIONS.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Horizontal scroll gallery */}
        <div
          className="hide-scrollbar"
          style={{
            flex: 1,
            display: 'flex',
            overflowX: 'auto',
            overflowY: 'hidden',
            padding: '10px 20px 40px',
            gap: 16,
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'x mandatory',
            alignItems: 'center',
          }}
        >
          {APPRECIATIONS.map((item, idx) => {
            const isSeen = seenCards.includes(item.id)

            return (
              <motion.div
                key={item.id}
                initial={{ x: 60, opacity: 0, rotateY: -15, scale: 0.9 }}
                animate={inView ? { x: 0, opacity: 1, rotateY: 0, scale: 1 } : {}}
                transition={{ delay: 0.2 + idx * 0.1, duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
                whileTap={{ scale: 0.96 }}
                onClick={(e) => markSeen(item.id, e)}
                style={{
                  flexShrink: 0,
                  width: 270,
                  height: 'calc(100svh - 220px)',
                  maxHeight: 460,
                  background: isSeen 
                    ? 'linear-gradient(145deg, #fff 0%, #FAF6F0 100%)' 
                    : 'linear-gradient(145deg, #fff 0%, #fefcfb 100%)',
                  borderRadius: 20,
                  padding: '28px',
                  position: 'relative',
                  scrollSnapAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  // Luxurious drop shadow and border
                  boxShadow: isSeen 
                    ? '0 0 0 2px rgba(127,29,29,0.15), 0 12px 40px rgba(127,29,29,0.12)' 
                    : '0 8px 30px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(0,0,0,0.03)',
                  transition: 'box-shadow 0.6s, background 0.6s',
                }}
              >
                {/* Magical burst when tapped */}
                {activeParticle === item.id && (
                  <HeartParticles active={true} origin={particleOrigin} />
                )}

                {/* Card number header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 24,
                    fontStyle: 'italic',
                    color: isSeen ? 'var(--accent-crimson)' : 'rgba(28,25,23,0.2)',
                    fontWeight: 600,
                    transition: 'color 0.6s',
                  }}>
                    {item.id}
                  </div>
                  
                  {/* "Seen" elegant stamp */}
                  <AnimatePresence>
                    {isSeen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0, rotate: -20 }}
                        animate={{ opacity: 1, scale: 1, rotate: -10 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        style={{
                          fontFamily: 'var(--font-hand)',
                          fontSize: 16,
                          color: 'var(--accent-amber)',
                          border: '1px solid var(--accent-amber)',
                          borderRadius: 6,
                          padding: '2px 8px',
                          opacity: 0.8,
                        }}
                      >
                        adored
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Main romantic text */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 21,
                    fontWeight: 500,
                    color: isSeen ? 'var(--text-main)' : 'rgba(28,25,23,0.8)',
                    lineHeight: 1.45,
                    letterSpacing: '-0.01em',
                  }}>
                    {item.text}
                  </p>
                </div>

                {/* Bottom decorative area */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  borderTop: '1px solid rgba(127,29,29,0.08)',
                  paddingTop: 16,
                }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    color: 'var(--text-main)',
                    opacity: 0.3,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}>
                    {isSeen ? 'Read' : 'Tap to unlock'}
                  </div>
                  <motion.div 
                    animate={isSeen ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                    transition={{ duration: 0.6 }}
                    style={{ fontSize: 32, filter: isSeen ? 'drop-shadow(0 4px 12px rgba(220,38,38,0.3))' : 'grayscale(100%) opacity(30%)' }}
                  >
                    {item.emoji}
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
