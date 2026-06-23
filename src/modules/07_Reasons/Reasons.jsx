import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const REASONS = [
  { emoji: '🌙', text: 'The way you say goodnight makes me sleep better than anything else in the world.' },
  { emoji: '🎶', text: 'Your voice is literally my favorite sound. I could listen to you talk forever.' },
  { emoji: '✨', text: 'You make ordinary moments feel like the most beautiful things that have ever happened.' },
  { emoji: '🤍', text: 'The complete peace I feel just being on a silent call with you. Nothing compares.' },
  { emoji: '😂', text: 'The way you laugh. I would do anything just to hear that laugh every single day.' },
  { emoji: '💬', text: 'One text from you can completely turn around my worst day. Every single time.' },
  { emoji: '🌹', text: 'You chose to stay. Through the distance, the waiting, the screens. You stayed.' },
  { emoji: '🫂', text: 'I don\'t need a reason. I just know — you are the person I want, every single day.' },
]

export default function ReasonsSection() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const goNext = () => {
    setDirection(1)
    setIndex(i => (i + 1) % REASONS.length)
  }

  const goPrev = () => {
    setDirection(-1)
    setIndex(i => (i - 1 + REASONS.length) % REASONS.length)
  }

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
        padding: '0 24px',
        background: 'var(--bg-cream)',
        gap: 32,
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontFamily: 'var(--font-hand)',
          fontSize: 18,
          color: 'var(--accent-crimson)',
          opacity: 0.7,
          marginBottom: 4,
        }}>
          reasons i love you
        </p>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 30,
          fontWeight: 600,
          color: 'var(--text-main)',
          letterSpacing: '-0.02em',
        }}>
          let me count the ways
        </h2>
      </div>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: 340, position: 'relative', height: 260 }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            initial={{ x: direction * 80, opacity: 0, scale: 0.95 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: direction * -80, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(145deg, #fff 0%, #fff8f9 100%)',
              borderRadius: 24,
              border: '1px solid rgba(136,19,55,0.08)',
              boxShadow: '0 12px 40px rgba(136,19,55,0.1), 0 2px 8px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px 28px',
              gap: 20,
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: 48 }}>{card.emoji}</span>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 18,
              color: 'var(--text-main)',
              lineHeight: 1.55,
              fontWeight: 400,
            }}>
              {card.text}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {REASONS.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i) }}
            style={{
              width: i === index ? 18 : 6,
              height: 6,
              borderRadius: 999,
              background: i === index ? 'var(--accent-crimson)' : 'rgba(136,19,55,0.2)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Nav arrows */}
      <div style={{ display: 'flex', gap: 16 }}>
        <button
          onClick={goPrev}
          style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'rgba(136,19,55,0.06)',
            border: '1px solid rgba(136,19,55,0.12)',
            fontSize: 20, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent-crimson)',
          }}
        >
          ←
        </button>
        <button
          onClick={goNext}
          style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'var(--accent-crimson)',
            border: 'none',
            fontSize: 20, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 16px rgba(136,19,55,0.3)',
          }}
        >
          →
        </button>
      </div>
    </section>
  )
}
