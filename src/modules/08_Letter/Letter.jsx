import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { LETTER } from '../../config/content'

// Soft floating light dust for the letter reveal
function Dust() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 10 }}>
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 100 + Math.random() * 100, x: Math.random() * 300 }}
          animate={{ 
            opacity: [0, 0.4, 0], 
            y: -100,
            x: `+=${Math.random() > 0.5 ? 50 : -50}` 
          }}
          transition={{ 
            duration: 6 + Math.random() * 4, 
            repeat: Infinity, 
            delay: Math.random() * 4,
            ease: 'linear'
          }}
          style={{
            position: 'absolute',
            width: 3,
            height: 3,
            background: '#fff',
            borderRadius: '50%',
            boxShadow: '0 0 12px rgba(251,207,232,0.8)',
          }}
        />
      ))}
    </div>
  )
}

export default function LetterSection() {
  const [opened, setOpened] = useState(
    () => localStorage.getItem('letter_opened') === 'true'
  )
  const [showLetter, setShowLetter] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  const openLetter = () => {
    setOpened(true)
    localStorage.setItem('letter_opened', 'true')
    setTimeout(() => setShowLetter(true), 900) 
  }

  return (
    <section
      className="section"
      id="letter"
      data-section-index="8"
      ref={ref}
      style={{ zIndex: showLetter ? 100 : 1 }}
    >
      <AnimatePresence>
        {showLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="cinematic-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 90,
              background: 'radial-gradient(ellipse at center, rgba(30,5,10,0.85) 0%, rgba(10,2,4,0.95) 100%)',
              backdropFilter: 'blur(8px)',
              pointerEvents: 'none',
            }}
          >
            <Dust />
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 24px',
        gap: 16,
        position: 'relative',
        zIndex: 100,
      }}>

        {!showLetter ? (
          /* Envelope */
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={inView ? { scale: 1, opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 1.2, ease: 'easeOut' }}
            style={{ width: '100%', maxWidth: 340 }}
          >
            <motion.span
              className="section-label"
              style={{ 
                padding: 0, 
                marginBottom: 32, 
                display: 'block', 
                textAlign: 'center',
                color: 'var(--text-main)',
                opacity: 0.6,
                fontSize: 18,
                letterSpacing: '0.04em'
              }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
            >
              a letter, just for you
            </motion.span>

            <motion.div
              layoutId="envelope"
              onClick={!opened ? openLetter : () => setShowLetter(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                cursor: 'pointer',
                position: 'relative',
                width: '100%',
                height: 240,
                perspective: 1000,
              }}
            >
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, #FFF, #FAF6F0)',
                border: '1px solid rgba(136,19,55,0.1)',
                borderRadius: 12,
                boxShadow: '0 20px 50px rgba(0,0,0,0.08), inset 0 0 40px rgba(136,19,55,0.02)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 16,
                transformStyle: 'preserve-3d',
              }}>
                <motion.div
                  animate={opened ? { rotateX: -180, opacity: 0 } : { rotateX: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                  style={{ transformOrigin: 'top', transformStyle: 'preserve-3d' }}
                >
                  <div style={{ fontSize: 42, filter: 'drop-shadow(0 4px 12px rgba(136,19,55,0.2))' }}>
                    ✉️
                  </div>
                </motion.div>
                
                <motion.p 
                  animate={opened ? { opacity: 0 } : { opacity: 1 }}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 16,
                    fontStyle: 'italic',
                    color: 'var(--text-main)',
                    opacity: 0.7,
                  }}
                >
                  tap to open
                </motion.p>

                {/* Wax seal */}
                <AnimatePresence>
                  {opened && (
                    <motion.div 
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      style={{
                        position: 'absolute',
                        bottom: -20,
                        right: 32,
                        width: 56,
                        height: 56,
                        background: 'radial-gradient(circle at 30% 30%, #be123c, #881337)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 24,
                        boxShadow: '0 8px 20px rgba(136,19,55,0.4), inset 0 0 10px rgba(0,0,0,0.3)',
                        border: '2px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                      }}
                    >
                      <span style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.4))' }}>🤍</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          /* Letter Reveal */
          <motion.div
            layoutId="envelope"
            initial={{ scale: 0.95, opacity: 0, y: 20, rotateX: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
            style={{
              width: '100%',
              maxWidth: 400,
              maxHeight: '85svh',
              overflowY: 'auto',
              borderRadius: 16,
              boxShadow: '0 40px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)',
              position: 'relative',
              background: '#FCFBF9',
              transformPerspective: 1000,
            }}
            className="hide-scrollbar linen-paper"
          >
            <div style={{ padding: '48px 36px', position: 'relative' }}>
              {/* Elegant Gold Accents */}
              <div style={{ position: 'absolute', top: 16, left: 16, right: 16, bottom: 16, border: '1px solid rgba(217,119,6,0.1)', borderRadius: 8, pointerEvents: 'none' }} />
              
              <div style={{ position: 'relative', marginBottom: 40 }}>
                <span style={{
                  fontFamily: 'var(--font-hand)',
                  fontSize: 32,
                  color: 'var(--text-main)',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                }}>
                  hey sneha,
                </span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 2.5, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: 60,
                    height: 2,
                    background: 'var(--accent-amber)',
                    opacity: 0.5,
                    transformOrigin: 'left',
                  }}
                />
              </div>

              <p style={{
                fontFamily: 'var(--font-hand)',
                fontSize: 22,
                color: 'var(--text-main)',
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap',
                opacity: 0.85,
                textShadow: '0 1px 1px rgba(255,255,255,0.5)',
              }}>
                {LETTER.body.replace(/^hey sneha,\s*/i, '')}
              </p>
              
              <div style={{ marginTop: 48, textAlign: 'center' }}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLetter(false)}
                  style={{
                    background: 'none',
                    border: '1px solid rgba(136,19,55,0.2)',
                    borderRadius: 99,
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    color: 'var(--accent-crimson)',
                    fontSize: 16,
                    padding: '10px 24px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(136,19,55,0.05)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'none'
                  }}
                >
                  Fold letter gently
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
