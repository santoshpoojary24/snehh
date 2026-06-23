import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { PHOTOS } from '../../config/content'

const WARM_GRADIENTS = [
  'linear-gradient(135deg, #FDDCDC 0%, #FFF0F0 100%)',
  'linear-gradient(135deg, #FFF0D8 0%, #FFEAD0 100%)',
  'linear-gradient(135deg, #F8DCFF 0%, #F0E8FF 100%)',
  'linear-gradient(135deg, #FFEFC3 0%, #FFF8E8 100%)',
  'linear-gradient(135deg, #D4E8FF 0%, #EAF3FF 100%)',
]

const getRotation = (id) => {
  const seed = id * 137 % 8
  return (seed - 4) * 1.6
}

export default function PhotoDumpSection() {
  const [lightbox, setLightbox] = useState(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  const closeLightbox = () => setLightbox(null)
  const prevPhoto = (e) => { e.stopPropagation(); setLightbox(i => (i - 1 + PHOTOS.length) % PHOTOS.length) }
  const nextPhoto = (e) => { e.stopPropagation(); setLightbox(i => (i + 1) % PHOTOS.length) }

  return (
    <section className="section" id="photos" data-section-index="1" ref={ref}>
      {/* Ambient top glow */}
      <div style={{
        position: 'absolute',
        top: -60,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 300,
        height: 200,
        background: 'radial-gradient(ellipse at center, rgba(251,207,232,0.35) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div className="section-inner-scroll" style={{ padding: '20px 20px 100px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ marginBottom: 20 }}
        >
          <span className="section-label" style={{ padding: 0, display: 'block' }}>
            my fav pictures 🌹
          </span>
          <p style={{
            fontFamily: 'var(--font-hand)',
            fontSize: 15,
            color: 'var(--text-main)',
            opacity: 0.5,
            marginTop: 4,
          }}>
            saved forever, just like you ✨
          </p>
        </motion.div>

        {/* Polaroid grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 14,
        }}>
          {PHOTOS.map((photo, idx) => {
            const isWide = idx === 2
            const rotation = getRotation(photo.id)

            return (
              <motion.div
                key={photo.id}
                layoutId={`photo-${photo.id}`}
                initial={{ opacity: 0, scale: 0.88, y: 24 }}
                animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + idx * 0.1, duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
                whileTap={{ scale: 1.04 }}
                onClick={() => setLightbox(idx)}
                style={{
                  gridColumn: isWide ? 'span 2' : 'span 1',
                  rotate: rotation,
                  cursor: 'pointer',
                  transformOrigin: 'center center',
                }}
              >
                {/* Polaroid frame */}
                <div style={{
                  background: '#fff',
                  borderRadius: 4,
                  padding: '8px 8px 28px 8px',
                  boxShadow: '0 6px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
                  position: 'relative',
                }}>
                  {/* Photo area */}
                  <div style={{
                    height: isWide ? 190 : 160,
                    borderRadius: 2,
                    background: WARM_GRADIENTS[photo.id % WARM_GRADIENTS.length],
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                    {photo.src ? (
                      <img
                        src={photo.src}
                        alt={photo.caption}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                      }}>
                        <div style={{ fontSize: 28, opacity: 0.4 }}>🌹</div>
                        <div style={{
                          fontFamily: 'var(--font-hand)',
                          fontSize: 12,
                          color: 'var(--text-main)',
                          opacity: 0.4,
                        }}>add photo {photo.id}</div>
                      </div>
                    )}
                    {/* Soft vignette overlay */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.08) 100%)',
                      pointerEvents: 'none',
                    }} />
                  </div>

                  {/* Caption on polaroid strip */}
                  <div style={{
                    position: 'absolute',
                    bottom: 6,
                    left: 8,
                    right: 8,
                    textAlign: 'center',
                  }}>
                    <p style={{
                      fontFamily: 'var(--font-hand)',
                      fontSize: 11,
                      color: '#555',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {photo.caption}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Cinematic Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            key="lightbox-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeLightbox}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15,10,10,0.95)',
              zIndex: 200,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
              backdropFilter: 'blur(8px)',
            }}
          >
            {/* Ambient glow behind photo */}
            <div style={{
              position: 'absolute',
              width: 280,
              height: 280,
              background: 'radial-gradient(ellipse, rgba(127,29,29,0.25) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <motion.div
              layoutId={`photo-${PHOTOS[lightbox]?.id}`}
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', maxWidth: 340, position: 'relative', zIndex: 1 }}
            >
              {/* Large polaroid */}
              <div style={{
                background: '#fff',
                borderRadius: 4,
                padding: '10px 10px 56px 10px',
                boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
              }}>
                <div style={{
                  height: 380,
                  background: WARM_GRADIENTS[PHOTOS[lightbox]?.id % WARM_GRADIENTS.length],
                  borderRadius: 2,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {PHOTOS[lightbox]?.src ? (
                    <img
                      src={PHOTOS[lightbox].src}
                      alt={PHOTOS[lightbox].caption}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  ) : (
                    <div style={{ fontSize: 48, opacity: 0.3 }}>🌹</div>
                  )}
                </div>
                {/* Polaroid caption strip */}
                <div style={{ textAlign: 'center', paddingTop: 12 }}>
                  <p style={{
                    fontFamily: 'var(--font-hand)',
                    fontSize: 18,
                    color: '#333',
                    lineHeight: 1.3,
                  }}>
                    {PHOTOS[lightbox]?.caption}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: '#999',
                    marginTop: 4,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}>
                    {PHOTOS[lightbox]?.date}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Navigation */}
            <div style={{ display: 'flex', gap: 20, marginTop: 24, alignItems: 'center', position: 'relative', zIndex: 1 }}>
              <button onClick={prevPhoto} style={navBtnStyle}>←</button>
              <span style={{
                fontFamily: 'var(--font-hand)',
                fontSize: 14,
                color: 'rgba(255,255,255,0.4)',
              }}>
                {lightbox + 1} / {PHOTOS.length}
              </span>
              <button onClick={nextPhoto} style={navBtnStyle}>→</button>
            </div>

            <button
              onClick={closeLightbox}
              style={{
                marginTop: 16,
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.35)',
                fontSize: 13,
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                letterSpacing: '0.05em',
              }}
            >
              tap to close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

const navBtnStyle = {
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.15)',
  color: '#fff',
  borderRadius: '50%',
  width: 48,
  height: 48,
  fontSize: 18,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backdropFilter: 'blur(4px)',
}
