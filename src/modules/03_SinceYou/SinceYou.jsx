import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { SINCE_YOU } from '../../config/content'

function useDayCounter(startDate) {
  const [days, setDays] = useState(0)
  useEffect(() => {
    const calc = () => {
      const start = new Date(startDate)
      const now = new Date()
      const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24))
      setDays(diff)
    }
    calc()
    const t = setInterval(calc, 60000)
    return () => clearInterval(t)
  }, [startDate])
  return days
}

// Animated count-up number
function CountUp({ target, duration = 1.5 }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (!target) return
    const start = Date.now()
    const raf = () => {
      const elapsed = (Date.now() - start) / 1000
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [target, duration])
  return display
}

export default function SinceYouSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const [activeCard, setActiveCard] = useState(null)
  const days = useDayCounter(SINCE_YOU.startDate)
  const count = CountUp({ target: inView ? days : 0, duration: 1.8 })

  return (
    <section className="section" id="since-you" data-section-index="2" ref={ref}>
      {/* Warm ambient glow */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 320,
        height: 320,
        background: 'radial-gradient(ellipse, rgba(217,119,6,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div className="section-inner-scroll hide-scrollbar" style={{ padding: '24px 20px 100px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ marginBottom: 28 }}
        >
          <span className="section-label" style={{ padding: 0 }}>
            since you.
          </span>
        </motion.div>

        {/* Day counter card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 1, ease: [0.25, 1, 0.5, 1] }}
          style={{
            background: 'linear-gradient(135deg, var(--accent-crimson) 0%, #9B2226 100%)',
            borderRadius: 20,
            padding: '28px 24px',
            marginBottom: 20,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(127,29,29,0.35)',
          }}
        >
          {/* Decorative blur circles */}
          <div style={{
            position: 'absolute', top: -30, right: -30,
            width: 120, height: 120,
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: -20, left: -20,
            width: 80, height: 80,
            background: 'rgba(255,255,255,0.04)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }} />

          <div style={{
            fontFamily: 'var(--font-hand)',
            fontSize: 14,
            color: 'rgba(255,255,255,0.7)',
            letterSpacing: '0.04em',
            marginBottom: 8,
          }}>
            {SINCE_YOU.since}
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 6 }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 72,
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1,
              letterSpacing: '-3px',
            }}>
              {count}
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.7)',
              paddingBottom: 10,
            }}>
              days
            </div>
          </div>

          <div style={{
            fontFamily: 'var(--font-hand)',
            fontSize: 15,
            color: 'rgba(255,255,255,0.75)',
            lineHeight: 1.4,
          }}>
            {SINCE_YOU.subtitle}
          </div>
        </motion.div>

        {/* Feeling cards */}
        {SINCE_YOU.feelings.map((feeling, idx) => {
          const isOpen = activeCard === idx
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 + idx * 0.12, duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
              onClick={() => setActiveCard(isOpen ? null : idx)}
              style={{
                background: 'var(--card-white)',
                border: `1px solid ${isOpen ? 'rgba(127,29,29,0.3)' : 'var(--card-border)'}`,
                borderLeft: `3px solid ${isOpen ? 'var(--accent-crimson)' : 'var(--accent-amber)'}`,
                borderRadius: 14,
                padding: '14px 16px',
                marginBottom: 12,
                cursor: 'pointer',
                boxShadow: isOpen ? '0 8px 28px rgba(127,29,29,0.1)' : '0 2px 12px rgba(0,0,0,0.04)',
                transition: 'border-color 0.4s, box-shadow 0.4s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>{feeling.emoji}</span>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontSize: 15,
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  flex: 1,
                }}>
                  {feeling.title}
                </div>
                <motion.span
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    fontSize: 12,
                    color: 'var(--text-main)',
                    opacity: 0.3,
                    display: 'block',
                  }}
                >
                  ›
                </motion.span>
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p style={{
                      fontFamily: 'var(--font-hand)',
                      fontSize: 15,
                      color: 'var(--text-main)',
                      opacity: 0.8,
                      lineHeight: 1.65,
                      marginTop: 12,
                      paddingTop: 10,
                      borderTop: '1px solid var(--card-border)',
                    }}>
                      {feeling.note}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
