import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EASTER_EGG } from '../../config/content'
import { useApp } from '../../context/AppContext'

export default function EasterEgg() {
  const { eggVisible, setEggVisible, showToast } = useApp()

  useEffect(() => {
    if (!eggVisible) return
    const t = setTimeout(() => {
      setEggVisible(false)
      showToast('secret locked 🔒')
    }, 15000)
    return () => clearTimeout(t)
  }, [eggVisible, setEggVisible, showToast])

  return (
    <AnimatePresence>
      {eggVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          onClick={() => { setEggVisible(false); showToast('secret locked 🔒') }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(127, 29, 29, 0.96)', // Deep velvet red
            backdropFilter: 'blur(10px)',
            zIndex: 200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 32,
            gap: 24,
            overflow: 'hidden',
          }}
        >
          {/* Gentle rising ambient embers */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: '110vh', x: `${(i * 7.3) % 100}vw`, opacity: 0, scale: Math.random() * 0.5 + 0.5 }}
                animate={{ y: '-10vh', opacity: [0, 0.8, 0.8, 0] }}
                transition={{
                  duration: 8 + (i % 5) * 2,
                  delay: (i * 0.5) % 5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  position: 'absolute',
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: i % 2 === 0 ? 'var(--accent-amber)' : 'var(--glow-blush)',
                  boxShadow: '0 0 10px var(--accent-amber)',
                  bottom: 0,
                }}
              />
            ))}
          </div>

          <motion.p
            initial={{ y: 30, opacity: 0, filter: 'blur(4px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.8, duration: 1.5, ease: 'easeOut' }}
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 36,
              color: '#fff',
              textAlign: 'center',
              lineHeight: 1.3,
            }}
          >
            My Heart. ❤️
          </motion.p>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5, duration: 1.5 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 16,
              color: 'rgba(255,255,255,0.85)',
              textAlign: 'center',
              maxWidth: 280,
              lineHeight: 1.8,
              whiteSpace: 'pre-wrap',
            }}
          >
            {EASTER_EGG.message}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 2 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 14,
              color: 'rgba(255,255,255,0.4)',
              marginTop: 40,
            }}
          >
            tap anywhere to close
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
