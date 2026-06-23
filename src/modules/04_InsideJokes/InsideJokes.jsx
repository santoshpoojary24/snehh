import React, { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { INSIDE_JOKES } from '../../config/content'

export default function InsideJokesSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const [activeCard, setActiveCard] = useState(null)

  return (
    <section
      className="section"
      id="jokes"
      data-section-index="3"
      ref={ref}
      style={{ backgroundColor: 'var(--bg-cream)' }}
    >
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{
          padding: '24px 24px 12px',
          flexShrink: 0,
        }}>
          <motion.h2
            className="section-label"
            style={{ padding: 0 }}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            Things unspoken.
          </motion.h2>
        </div>

        {/* Linen cards grid */}
        <div
          className="section-inner-scroll hide-scrollbar"
          style={{ flex: 1, padding: '12px 24px 100px' }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
          }}>
            {INSIDE_JOKES.map((joke, idx) => {
              const isActive = activeCard === joke.id

              return (
                <motion.div
                  key={joke.id}
                  initial={{ y: 30, opacity: 0 }}
                  animate={inView ? { y: 0, opacity: 1 } : {}}
                  transition={{ delay: 0.2 + idx * 0.1, duration: 1, ease: 'easeOut' }}
                  onClick={() => setActiveCard(isActive ? null : joke.id)}
                  style={{ cursor: 'pointer', perspective: 1000 }}
                >
                  <motion.div
                    className="linen-paper"
                    animate={{
                      scale: isActive ? 1.05 : 1,
                      boxShadow: isActive ? '0 12px 30px rgba(127, 29, 29, 0.15)' : '0 4px 15px rgba(0,0,0,0.04)',
                      borderColor: isActive ? 'var(--accent-amber)' : 'var(--card-border)',
                    }}
                    transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                    style={{
                      borderRadius: 12,
                      padding: '20px 16px',
                      minHeight: 120,
                      border: '1px solid',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Soft glow background when active */}
                    <motion.div
                      animate={{ opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.6 }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(circle at center, rgba(251,207,232,0.3) 0%, transparent 70%)',
                        pointerEvents: 'none',
                      }}
                    />

                    <motion.p
                      animate={{ y: isActive ? -10 : 0, opacity: isActive ? 0.6 : 1 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 16,
                        color: 'var(--text-main)',
                        fontWeight: 600,
                        lineHeight: 1.3,
                        textAlign: 'center',
                        position: 'relative',
                        zIndex: 2,
                      }}
                    >
                      {joke.title}
                    </motion.p>

                    <AnimatePresence>
                      {isActive && joke.context && (
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          style={{
                            fontFamily: 'var(--font-hand)',
                            fontSize: 15,
                            color: 'var(--accent-crimson)',
                            marginTop: 12,
                            lineHeight: 1.4,
                            textAlign: 'center',
                            position: 'relative',
                            zIndex: 2,
                          }}
                        >
                          {joke.context}
                        </motion.p>
                      )}
                    </AnimatePresence>
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
