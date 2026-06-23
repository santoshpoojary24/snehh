import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Floating petal particle (stylized)
function Petal({ delay, startX, duration, scale = 1 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: startX, y: -20, rotate: 0, scale: 0.8 * scale }}
      animate={{
        opacity: [0, 0.7, 0.7, 0],
        y: ['-5vh', '105vh'],
        x: [startX, startX + (Math.random() > 0.5 ? 40 : -40)],
        rotate: [0, 360],
        scale: [0.8 * scale, 1.1 * scale, 0.9 * scale],
      }}
      transition={{
        duration,
        delay,
        ease: 'linear',
        repeat: Infinity,
        repeatDelay: Math.random() * 2,
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 14,
        height: 10,
        borderRadius: '50% 50% 50% 0',
        background: 'radial-gradient(ellipse, rgba(220,38,38,0.8), rgba(127,29,29,0.9))',
        boxShadow: '0 0 10px rgba(220,38,38,0.3)',
        filter: 'blur(0.5px)',
        opacity: 0,
        pointerEvents: 'none',
        zIndex: 5,
      }}
    />
  )
}

// Glowing light dust particle
function Dust({ delay, startX, duration }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: startX, y: '100vh', scale: 0.5 }}
      animate={{
        opacity: [0, 0.5, 0],
        y: ['100vh', '30vh'],
        x: [startX, startX + (Math.random() > 0.5 ? 20 : -20)],
      }}
      transition={{
        duration,
        delay,
        ease: 'easeOut',
        repeat: Infinity,
        repeatDelay: Math.random() * 3,
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 4,
        height: 4,
        borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 0 8px #fff, 0 0 12px rgba(251,207,232,0.8)',
        opacity: 0,
        pointerEvents: 'none',
        zIndex: 2,
      }}
    />
  )
}

// Explosive burst particle for when bouquet is accepted
function BurstParticle({ angle, speed, size, type }) {
  const distance = 100 + Math.random() * 150
  const endX = Math.cos(angle) * distance + 'vw'
  const endY = Math.sin(angle) * distance + 'vh'

  return (
    <motion.div
      initial={{ opacity: 1, x: '50vw', y: '50vh', scale: 0 }}
      animate={{
        opacity: [1, 1, 0],
        x: `calc(50vw + ${Math.cos(angle) * (speed * 150)}px)`,
        y: `calc(50vh + ${Math.sin(angle) * (speed * 150)}px)`,
        scale: [0, size, size * 1.5],
        rotate: type === 'petal' ? Math.random() * 360 : 0,
      }}
      transition={{ duration: 1 + Math.random(), ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: type === 'petal' ? 14 : 6,
        height: type === 'petal' ? 10 : 6,
        borderRadius: type === 'petal' ? '50% 50% 50% 0' : '50%',
        background: type === 'petal' 
          ? 'radial-gradient(ellipse, rgba(220,38,38,0.9), rgba(153,27,27,1))' 
          : '#fff',
        boxShadow: type === 'petal'
          ? '0 0 15px rgba(220,38,38,0.6)'
          : '0 0 15px #fff, 0 0 20px rgba(251,207,232,0.8)',
        zIndex: 50,
        pointerEvents: 'none',
        transformOrigin: 'center center',
      }}
    />
  )
}

const PETALS = Array.from({ length: 15 }, (_, i) => ({
  id: `p-${i}`,
  delay: i * 0.3,
  startX: `${5 + (i * 6.5) % 90}vw`,
  duration: 5 + (i % 4),
  scale: 0.7 + Math.random() * 0.6,
}))

const DUST = Array.from({ length: 20 }, (_, i) => ({
  id: `d-${i}`,
  delay: i * 0.2,
  startX: `${10 + (i * 4) % 80}vw`,
  duration: 3 + Math.random() * 3,
}))

export default function BouquetIntro({ onEnter }) {
  const [phase, setPhase] = useState('arriving') // arriving → waiting → leaving

  useEffect(() => {
    // After bouquet arrives, move to waiting state
    const t = setTimeout(() => setPhase('waiting'), 2200)
    return () => clearTimeout(t)
  }, [])

  const handleAccept = () => {
    setPhase('leaving')
    // Wait slightly longer for the explosion animation to be fully appreciated
    setTimeout(onEnter, 1800)
  }

  return (
    <AnimatePresence>
      {phase !== 'gone' && (
        <motion.div
          key="bouquet-intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'fixed',
            inset: 0,
            // Deep, rich cinematic dark background
            background: 'radial-gradient(ellipse at center, #1F070B 0%, #080102 60%, #000000 100%)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Particles */}
          {PETALS.map(p => <Petal key={p.id} {...p} />)}
          {DUST.map(d => <Dust key={d.id} {...d} />)}

          {/* Explosion burst when leaving */}
          {phase === 'leaving' && (
            <>
              {Array.from({ length: 60 }).map((_, i) => (
                <BurstParticle 
                  key={`burst-${i}`}
                  angle={(i * 360) / 60 + Math.random() * 20}
                  speed={0.5 + Math.random() * 1.5}
                  size={0.5 + Math.random() * 1.5}
                  type={Math.random() > 0.3 ? 'petal' : 'light'}
                />
              ))}
            </>
          )}

          {/* Ambient rim light behind bouquet */}
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80vw',
              height: '80vw',
              maxWidth: 400,
              maxHeight: 400,
              borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(153,27,27,0.3) 0%, transparent 60%)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          {/* ── Realistic Bouquet Image ── */}
          <motion.div
            initial={{ y: '20vh', scale: 0.8, opacity: 0 }}
            animate={phase === 'leaving'
              ? { y: '-15vh', scale: 1.4, opacity: 0, filter: 'blur(12px)' }
              : { y: '-4vh', scale: 1, opacity: 1, filter: 'blur(0px)' }
            }
            transition={phase === 'leaving'
              ? { duration: 1.2, ease: [0.25, 1, 0.5, 1] }
              : { duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }
            }
            style={{
              position: 'relative',
              zIndex: 10,
              width: '90%',
              maxWidth: 380,
              aspectRatio: '1/1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}
          >
            <motion.img
              src="/assets/bouquet.png"
              alt="Beautiful Rose Bouquet"
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                // This blends the pure black background of the generated image perfectly into our dark UI
                mixBlendMode: 'screen',
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.8))',
              }}
            />
          </motion.div>

          {/* Text & CTA */}
          <AnimatePresence>
            {phase === 'waiting' && (
              <motion.div
                initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 20,
                  padding: '0 32px',
                  marginTop: -20,
                }}
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1], scale: [0.95, 1, 1] }}
                  transition={{ duration: 2, times: [0, 0.4, 1] }}
                  style={{
                    fontFamily: 'var(--font-hand)',
                    fontSize: 20,
                    color: 'rgba(255,255,255,0.7)',
                    marginBottom: 4,
                    letterSpacing: '0.04em',
                  }}
                >
                  for you,
                </motion.p>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontSize: 42,
                  fontWeight: 600,
                  color: '#fff',
                  marginBottom: 36,
                  letterSpacing: '-0.02em',
                  textShadow: '0 0 20px rgba(220,38,38,0.4), 0 4px 12px rgba(0,0,0,0.5)',
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
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 20px rgba(220,38,38,0.1)',
                    transition: 'border-color 0.3s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(220,38,38,0.7)'
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(220,38,38,0.2), inset 0 0 20px rgba(220,38,38,0.2)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(220,38,38,0.3)'
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4), inset 0 0 20px rgba(220,38,38,0.1)'
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
