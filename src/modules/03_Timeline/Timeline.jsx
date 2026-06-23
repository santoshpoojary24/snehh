import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { TIMELINE } from '../../config/content'

export default function TimelineSection() {
  const [expandedIdx, setExpandedIdx] = useState(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section className="section" id="timeline" data-section-index="2" ref={ref}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 200,
        background: 'linear-gradient(to bottom, rgba(217, 119, 6, 0.07) 0%, transparent 100%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ padding: '20px 20px 12px', flexShrink: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <span className="section-label" style={{ padding: 0 }}>
              our timeline.
            </span>
            <p style={{
              fontFamily: 'var(--font-hand)',
              fontSize: 15,
              color: 'var(--text-main)',
              opacity: 0.45,
              marginTop: 4,
            }}>
              every chapter, written together 🌙
            </p>
          </motion.div>
        </div>

        {/* Scrollable list */}
        <div className="section-inner-scroll hide-scrollbar" style={{ flex: 1, padding: '8px 20px 100px' }}>
          <div style={{ position: 'relative', paddingLeft: 44 }}>

            {/* Gradient vertical line */}
            <motion.div
              initial={{ scaleY: 0, originY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.4, delay: 0.3, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: 18,
                top: 18,
                bottom: 18,
                width: 2,
                background: 'linear-gradient(to bottom, var(--accent-crimson), var(--accent-amber), rgba(250,246,240,0))',
                borderRadius: 999,
                transformOrigin: 'top',
              }}
            />

            {TIMELINE.map((entry, idx) => {
              const isExpanded = expandedIdx === idx

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -24 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + idx * 0.18, duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
                  style={{ marginBottom: 20, position: 'relative', cursor: 'pointer' }}
                  onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                >
                  {/* Glowing node */}
                  <motion.div
                    animate={isExpanded ? {
                      boxShadow: '0 0 0 6px rgba(127,29,29,0.1), 0 0 20px rgba(127,29,29,0.2)',
                      scale: 1.1,
                    } : {
                      boxShadow: '0 2px 10px rgba(127,29,29,0.15)',
                      scale: 1,
                    }}
                    transition={{ duration: 0.4 }}
                    style={{
                      position: 'absolute',
                      left: -44,
                      top: 12,
                      width: 36,
                      height: 36,
                      background: isExpanded
                        ? 'linear-gradient(135deg, var(--accent-crimson), var(--accent-amber))'
                        : 'var(--bg-cream)',
                      border: `2px solid ${isExpanded ? 'transparent' : 'var(--card-border)'}`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      zIndex: 2,
                      transition: 'background 0.4s',
                    }}
                  >
                    {entry.emoji}
                  </motion.div>

                  {/* Card */}
                  <motion.div
                    animate={isExpanded ? {
                      borderColor: 'rgba(127,29,29,0.3)',
                      boxShadow: '0 8px 32px rgba(127,29,29,0.1)',
                    } : {
                      borderColor: 'rgba(127,29,29,0.12)',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    }}
                    style={{
                      background: 'var(--card-white)',
                      border: '1px solid var(--card-border)',
                      borderRadius: 14,
                      padding: '14px 16px',
                      borderLeft: `3px solid var(--accent-crimson)`,
                      transition: 'border-color 0.4s, box-shadow 0.4s',
                    }}
                  >
                    {/* Date chip */}
                    <div style={{ marginBottom: 6 }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: 'var(--accent-amber)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        fontWeight: 600,
                        background: 'rgba(217,119,6,0.08)',
                        padding: '2px 8px',
                        borderRadius: 999,
                      }}>
                        {entry.date}
                      </span>
                    </div>

                    {/* Headline */}
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 17,
                      fontWeight: 600,
                      fontStyle: 'italic',
                      color: 'var(--text-main)',
                      lineHeight: 1.3,
                    }}>
                      {entry.headline}
                    </div>

                    {/* Expandable story */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{
                            height: 1,
                            background: 'var(--card-border)',
                            margin: '12px 0',
                            opacity: 0.6,
                          }} />
                          <p style={{
                            fontFamily: 'var(--font-hand)',
                            fontSize: 15,
                            color: 'var(--text-main)',
                            lineHeight: 1.65,
                            opacity: 0.85,
                          }}>
                            {entry.story}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Hint */}
                    {!isExpanded && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 10,
                          color: 'var(--text-main)',
                          opacity: 0.3,
                          marginTop: 8,
                          letterSpacing: '0.04em',
                        }}
                      >
                        tap to read →
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
