import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const REASONS = [
  { emoji: '🌙', title: 'Your goodnight', text: 'The way you say goodnight makes me sleep better than anything in the world.' },
  { emoji: '🎶', title: 'Your voice', text: 'Your voice is my favourite sound. I could listen to you talk forever.' },
  { emoji: '✨', title: 'Your magic', text: 'You make ordinary moments feel like the most beautiful things that have ever happened.' },
  { emoji: '🤍', title: 'Your silence', text: 'The peace I feel just being on a silent call with you. Nothing in this world compares.' },
  { emoji: '😂', title: 'Your laugh', text: 'The way you laugh. I would do anything just to hear that sound every single day.' },
  { emoji: '💬', title: 'Your texts', text: 'One message from you can completely turn around my worst day. Every. Single. Time.' },
  { emoji: '🌹', title: 'You stayed', text: 'You chose to stay — through the distance, the screens, the waiting. You stayed.' },
  { emoji: '🫂', title: 'Just you', text: 'I don\'t need a reason. I just know — you are the one I want, every single day.' },
]

export default function ReasonsSection() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const goTo = (i) => {
    setDirection(i > index ? 1 : -1)
    setIndex(i)
  }
  const goNext = () => goTo((index + 1) % REASONS.length)
  const goPrev = () => goTo((index - 1 + REASONS.length) % REASONS.length)

  const card = REASONS[index]

  return (
    <section
      className="section"
      data-section-index="6"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 28px',
        background: 'var(--bg-cream)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Soft background accent */}
      <div style={{
        position: 'absolute', top: '10%', right: '-10%',
        width: 200, height: 200, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,21,53,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', left: '-10%',
        width: 180, height: 180, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(194,130,10,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <p style={{
          fontFamily: 'var(--font-hand)',
          fontSize: 19,
          color: 'var(--accent-crimson)',
          opacity: 0.65,
          marginBottom: 6,
          letterSpacing: '0.02em',
        }}>
          reasons i love you
        </p>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 32,
          fontWeight: 600,
          color: 'var(--text-main)',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
        }}>
          let me count<br />the ways
        </h2>
      </div>

      {/* Card stack */}
      <div style={{ width: '100%', maxWidth: 360, position: 'relative', height: 240 }}>
        {/* Shadow card behind for depth illusion */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(139,21,53,0.05)',
          borderRadius: 28,
          transform: 'translateY(6px) scale(0.96)',
        }} />

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ x: direction * 60, opacity: 0, scale: 0.97 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: direction * -60, opacity: 0, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(160deg, #ffffff 0%, #fff8f9 100%)',
              borderRadius: 28,
              border: '1px solid rgba(139,21,53,0.07)',
              boxShadow: '0 16px 48px rgba(139,21,53,0.1), 0 2px 4px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '28px 32px',
              gap: 14,
              textAlign: 'center',
            }}
          >
            {/* Card number */}
            <span style={{
              position: 'absolute', top: 16, right: 20,
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--accent-crimson)',
              opacity: 0.35,
              letterSpacing: '0.06em',
            }}>
              {String(index + 1).padStart(2, '0')} / {String(REASONS.length).padStart(2, '0')}
            </span>

            <span style={{ fontSize: 44, lineHeight: 1 }}>{card.emoji}</span>

            <p style={{
              fontFamily: 'var(--font-hand)',
              fontSize: 13,
              color: 'var(--accent-crimson)',
              opacity: 0.6,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              {card.title}
            </p>

            <p style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 17,
              color: 'var(--text-main)',
              lineHeight: 1.6,
              fontWeight: 400,
            }}>
              {card.text}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: 7, alignItems: 'center', marginTop: 28 }}>
        {REASONS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === index ? 20 : 6,
              height: 6,
              borderRadius: 999,
              background: i === index ? 'var(--accent-crimson)' : 'rgba(139,21,53,0.18)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.35s var(--ease-fluid)',
            }}
          />
        ))}
      </div>

      {/* Nav */}
      <div style={{ display: 'flex', gap: 14, marginTop: 20 }}>
        <button
          onClick={goPrev}
          style={{
            width: 52, height: 52, borderRadius: '50%',
            background: '#fff',
            border: '1px solid rgba(139,21,53,0.12)',
            fontSize: 20, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent-crimson)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            transition: 'transform 0.15s',
          }}
        >
          ←
        </button>
        <button
          onClick={goNext}
          style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'linear-gradient(145deg, #9f1239, #6B1126)',
            border: 'none',
            fontSize: 20, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 6px 20px rgba(139,21,53,0.35)',
            transition: 'transform 0.15s',
          }}
        >
          →
        </button>
      </div>
    </section>
  )
}
