import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Reduced from 15 → 6 petals to cut animation count on mobile
const PETALS = Array.from({ length: 6 }, (_, i) => ({
  id: `p-${i}`,
  delay: i * 0.6,
  startX: `${10 + (i * 15) % 80}vw`,
  duration: 6 + (i % 3),
  scale: 0.8 + (i % 3) * 0.1,
}))

// Reduced from 20 → 0 (dust removed — not noticeable but very expensive)
export default function BouquetIntro({ onEnter }) {
  const [phase, setPhase] = useState('arriving')

  useEffect(() => {
    const t = setTimeout(() => setPhase('waiting'), 2000)
    return () => clearTimeout(t)
  }, [])

  const handleAccept = useCallback(() => {
    setPhase('leaving')
    setTimeout(onEnter, 1200)
  }, [onEnter])

  return (
    <AnimatePresence>
      {phase !== 'gone' && (
        <motion.div
          key="bouquet-intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'radial-gradient(ellipse at center, #1F070B 0%, #080102 60%, #000000 100%)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Reduced to 6 petals (was 15+20 dust) */}
          {PETALS.map(p => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: p.startX, y: -20, rotate: 0 }}
              animate={{
                opacity: [0, 0.7, 0.7, 0],
                y: ['-5vh', '105vh'],
                rotate: [0, 180],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: 'linear',
                repeat: Infinity,
                repeatDelay: 2,
              }}
              style={{
                position: 'absolute',
                top: 0, left: 0,
                width: 12, height: 8,
                borderRadius: '50% 50% 50% 0',
                background: 'rgba(220,38,38,0.7)',
                pointerEvents: 'none',
                zIndex: 5,
              }}
            />
          ))}

          {/* Ambient rim light — CSS animation instead of framer-motion for free */}
          <div
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '70vw', height: '70vw',
              maxWidth: 350, maxHeight: 350,
              borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(153,27,27,0.2) 0%, transparent 60%)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          {/* Bouquet Image */}
          <motion.div
            initial={{ y: '15vh', scale: 0.85, opacity: 0 }}
            animate={phase === 'leaving'
              ? { y: '-15vh', scale: 1.3, opacity: 0 }
              : { y: '-4vh', scale: 1, opacity: 1 }
            }
            transition={phase === 'leaving'
              ? { duration: 1, ease: [0.25, 1, 0.5, 1] }
              : { duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }
            }
            style={{
              position: 'relative',
              zIndex: 10,
              width: '88%',
              maxWidth: 360,
              aspectRatio: '1/1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}
          >
            <img
              src="/assets/bouquet.png"
              alt="Beautiful Rose Bouquet"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                mixBlendMode: 'screen',
              }}
            />
          </motion.div>

          {/* Text & CTA */}
          <AnimatePresence>
            {phase === 'waiting' && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 20,
                  padding: '0 32px',
                  marginTop: -20,
                }}
              >
                <p style={{
                  fontFamily: 'var(--font-hand)',
                  fontSize: 20,
                  color: 'rgba(255,255,255,0.7)',
                  marginBottom: 4,
                  letterSpacing: '0.04em',
                }}>
                  for you,
                </p>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontSize: 42,
                  fontWeight: 600,
                  color: '#fff',
                  marginBottom: 36,
                  letterSpacing: '-0.02em',
                  textShadow: '0 0 20px rgba(220,38,38,0.4)',
                  background: 'linear-gradient(to bottom, #ffffff, #fbcfe8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Sneha 🌹
                </p>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAccept}
                  style={{
                    background: 'rgba(20,4,6,0.6)',
                    border: '1px solid rgba(220,38,38,0.3)',
                    borderRadius: 999,
                    padding: '16px 44px',
                    color: '#fff',
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontSize: 17,
                    fontWeight: 500,
                    cursor: 'pointer',
                    letterSpacing: '0.04em',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  }}
                >
                  receive the bouquet
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
