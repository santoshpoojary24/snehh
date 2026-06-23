import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

export default function DoodleBG() {
  // Generate a set of slow-moving, glowing ambient orbs
  const orbs = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: 40 + Math.random() * 120, // Huge soft orbs
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * -20,
      isCrimson: Math.random() > 0.5, // 50% crimson, 50% warm blush/gold
    }))
  }, [])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden',
      background: 'radial-gradient(ellipse at bottom, rgba(136,19,55,0.03) 0%, transparent 60%)',
    }}>
      {orbs.map(orb => (
        <motion.div
          key={orb.id}
          initial={{
            x: `${orb.x}vw`,
            y: `${orb.y}vh`,
            scale: 0.8,
            opacity: 0,
          }}
          animate={{
            x: [`${orb.x}vw`, `${(orb.x + 20) % 100}vw`, `${(orb.x - 10) % 100}vw`, `${orb.x}vw`],
            y: [`${orb.y}vh`, `${(orb.y - 20) % 100}vh`, `${(orb.y + 10) % 100}vh`, `${orb.y}vh`],
            scale: [0.8, 1.2, 0.9, 0.8],
            opacity: [0.1, 0.4, 0.2, 0.1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "linear",
            delay: orb.delay,
          }}
          style={{
            position: 'absolute',
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: orb.isCrimson 
              ? 'radial-gradient(circle, rgba(136,19,55,0.15) 0%, rgba(136,19,55,0) 70%)'
              : 'radial-gradient(circle, rgba(252,231,243,0.3) 0%, rgba(252,231,243,0) 70%)',
          }}
        />
      ))}

      {/* Gentle noise overlay to make the gradients feel like film/velvet */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.25,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
        mixBlendMode: 'overlay',
      }} />
    </div>
  )
}
