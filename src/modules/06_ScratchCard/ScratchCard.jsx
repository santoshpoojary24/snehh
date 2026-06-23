import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { SCRATCH_CARD } from '../../config/content'
import { useApp } from '../../context/AppContext'

export default function ScratchCardSection() {
  const canvasRef = useRef(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-20%' })
  const { fireConfetti } = useApp()

  const [scratchedRatio, setScratchedRatio] = useState(0)
  // Always start unrevealed so the user can experience the scratch every time
  const [isRevealed, setIsRevealed] = useState(false)
  const [sparks, setSparks] = useState([]) // For magical scratching dust

  const isDrawing = useRef(false)
  const lastPoint = useRef(null)

  useEffect(() => {
    if (isRevealed || !inView) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { willReadFrequently: true })

    const W = canvas.offsetWidth
    const H = canvas.offsetHeight
    canvas.width = W
    canvas.height = H

    // Draw luxurious velvet coating
    const fillVelvet = () => {
      // Deep crimson gradient
      const gradient = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W)
      gradient.addColorStop(0, '#991b1b') // Lighter red in middle
      gradient.addColorStop(1, '#450a0a') // Very dark red at edges
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, W, H)
      
      // Fabric texture
      ctx.fillStyle = 'rgba(0,0,0,0.15)'
      for(let i = 0; i < 8000; i++) {
        ctx.fillRect(Math.random() * W, Math.random() * H, 1.5, 1.5)
      }
      
      // Add a subtle "scratch me" indicator overlay
      ctx.font = 'italic 16px "Playfair Display", serif'
      ctx.fillStyle = 'rgba(255,255,255,0.4)'
      ctx.textAlign = 'center'
      ctx.fillText('rub to reveal', W / 2, H / 2 + 6)
    }
    fillVelvet()

    // Smooth scratch brush
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.lineWidth = 60 // Wide, soft brush
    // Soft edge for the brush using shadow
    ctx.shadowBlur = 10
    ctx.shadowColor = 'black'
  }, [inView, isRevealed])

  const calculateScratchPercent = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data
    
    let transparentCount = 0
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 20) transparentCount++
    }
    
    const totalPixels = pixels.length / 4
    const ratio = (transparentCount / totalPixels) * 100
    setScratchedRatio(ratio)

    // Reveal earlier so they don't have to scratch every corner (45% is a good threshold)
    if (ratio > 45 && !isRevealed) {
      setIsRevealed(true)
      // Removed localStorage persistence so they can scratch it again on reload
      
      // Fire romantic golden confetti
      fireConfetti('gold')
      
      canvas.style.transition = 'opacity 2s cubic-bezier(0.25, 1, 0.5, 1)'
      canvas.style.opacity = '0'
    }
  }, [isRevealed, fireConfetti])

  const createSpark = (x, y) => {
    if (Math.random() > 0.4) return // Throttle sparks
    const id = Date.now() + Math.random()
    setSparks(prev => [...prev, { id, x, y }])
    setTimeout(() => {
      setSparks(prev => prev.filter(s => s.id !== id))
    }, 600)
  }

  const scratch = (x, y) => {
    if (isRevealed) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { willReadFrequently: true })

    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    if (lastPoint.current) {
      ctx.moveTo(lastPoint.current.x, lastPoint.current.y)
      ctx.lineTo(x, y)
    } else {
      ctx.moveTo(x, y)
      ctx.lineTo(x+0.1, y+0.1)
    }
    ctx.stroke()
    lastPoint.current = { x, y }

    createSpark(x, y)

    // Throttle calculation
    if (Math.random() > 0.85) {
      calculateScratchPercent()
    }
  }

  const handleStart = (e) => {
    if (isRevealed) return
    isDrawing.current = true
    const rect = canvasRef.current.getBoundingClientRect()
    const touch = e.touches ? e.touches[0] : e
    scratch(touch.clientX - rect.left, touch.clientY - rect.top)
  }

  const handleMove = (e) => {
    if (!isDrawing.current || isRevealed) return
    if (e.cancelable) e.preventDefault()
    
    const rect = canvasRef.current.getBoundingClientRect()
    const touch = e.touches ? e.touches[0] : e
    scratch(touch.clientX - rect.left, touch.clientY - rect.top)
  }

  const handleEnd = () => {
    isDrawing.current = false
    lastPoint.current = null
  }

  return (
    <section
      className="section"
      id="scratch"
      data-section-index="5"
      ref={ref}
    >
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
      }}>
        
        <motion.h2
          initial={{ opacity: 0, y: -15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 24,
            fontStyle: 'italic',
            color: 'var(--accent-crimson)', // Fixed color so it's readable on cream background
            marginBottom: 28,
            textAlign: 'center',
            fontWeight: 500,
            letterSpacing: '0.02em',
          }}
        >
          {SCRATCH_CARD.label}
        </motion.h2>

        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: 360,
          aspectRatio: '16/11',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: isRevealed 
            ? '0 0 60px rgba(220,38,38,0.2), 0 0 0 1px rgba(255,255,255,0.1)' 
            : '0 20px 50px rgba(0,0,0,0.5)',
          transition: 'box-shadow 2s ease',
        }}>
          {/* Base Layer - The Reveal (Premium Card) */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #FAF6F0 0%, #E8DFD5 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px 28px',
            borderRadius: 24,
            boxShadow: 'inset 0 0 40px rgba(127,29,29,0.05)',
          }}>
            {/* Decorative Gold Accent Lines */}
            <div style={{ position: 'absolute', inset: 12, border: '1px solid rgba(180,83,9,0.2)', borderRadius: 12 }} />
            <div style={{ position: 'absolute', inset: 16, border: '1px solid rgba(180,83,9,0.1)', borderRadius: 8 }} />
            
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              color: '#450a0a',
              textAlign: 'center',
              lineHeight: 1.6,
              fontWeight: 500,
              zIndex: 2,
            }}>
              {SCRATCH_CARD.reveal}
            </p>
          </div>

          {/* Magical Dust Sparks while scratching */}
          <AnimatePresence>
            {sparks.map(spark => (
              <motion.div
                key={spark.id}
                initial={{ opacity: 1, scale: 1, x: spark.x, y: spark.y }}
                animate={{ 
                  opacity: 0, 
                  scale: 0,
                  y: spark.y - 40,
                  x: spark.x + (Math.random() - 0.5) * 40
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#fbbf24',
                  boxShadow: '0 0 10px #f59e0b',
                  pointerEvents: 'none',
                  zIndex: 20,
                  marginLeft: -3,
                  marginTop: -3,
                }}
              />
            ))}
          </AnimatePresence>

          {/* Top Layer - The Canvas */}
          {!isRevealed && (
            <canvas
              ref={canvasRef}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                touchAction: 'none',
                cursor: 'crosshair',
                borderRadius: 24,
                zIndex: 10,
              }}
              onMouseDown={handleStart}
              onMouseMove={handleMove}
              onMouseUp={handleEnd}
              onMouseLeave={handleEnd}
              onTouchStart={handleStart}
              onTouchMove={handleMove}
              onTouchEnd={handleEnd}
            />
          )}
        </div>

        {/* Ethereal Progress Indicator */}
        <AnimatePresence>
          {!isRevealed && scratchedRatio > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                marginTop: 24,
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Revealing... {Math.min(100, Math.round((scratchedRatio / 45) * 100))}%
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  )
}
