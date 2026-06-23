import React, { useEffect, useRef, useCallback } from 'react'
import { useApp } from '../../context/AppContext'

const SECTION_COUNT = 9

// Particle types
function makeParticle(style) {
  const base = {
    x: Math.random() * window.innerWidth,
    y: -20,
    vx: (Math.random() - 0.5) * 4,
    vy: Math.random() * 3 + 2,
    life: 1,
    decay: Math.random() * 0.01 + 0.008,
    size: Math.random() * 8 + 4,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 8,
    type: Math.random() > 0.7 ? 'star' : 'circle',
    emoji: Math.random() > 0.85 ? '🍮' : null,
  }

  switch (style) {
    case 'saffron':
      return { ...base, color: `hsl(${36 + Math.random() * 20}, 90%, ${55 + Math.random() * 15}%)` }
    case 'rainbow':
      return { ...base, color: `hsl(${Math.random() * 360}, 80%, 60%)` }
    case 'pink_gold':
      return { ...base, color: Math.random() > 0.5 ? '#F472B6' : '#F4A623' }
    case 'rasmalai_pink':
      return { ...base, color: `hsl(${320 + Math.random() * 30}, 80%, 65%)` }
    case 'purple_white':
      return { ...base, color: Math.random() > 0.5 ? '#A78BFA' : '#fff' }
    default:
      return { ...base, color: `hsl(${Math.random() * 60 + 20}, 80%, 60%)` }
  }
}

export default function ConfettiEngine() {
  const { confettiTrigger } = useApp()
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animFrameRef = useRef(null)
  const activeRef = useRef(false)

  const spawnParticles = useCallback((style, count = 80) => {
    const canvas = canvasRef.current
    if (!canvas) return
    for (let i = 0; i < count; i++) {
      particlesRef.current.push(makeParticle(style))
    }
    if (!activeRef.current) startLoop()
  }, [])

  const startLoop = useCallback(() => {
    activeRef.current = true
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const alive = []
      for (const p of particlesRef.current) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.08 // gravity
        p.vx *= 0.99
        p.life -= p.decay
        p.rotation += p.rotationSpeed

        if (p.life <= 0) continue
        alive.push(p)

        ctx.save()
        ctx.globalAlpha = p.life
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)

        if (p.emoji) {
          ctx.font = `${p.size * 2}px serif`
          ctx.textAlign = 'center'
          ctx.fillText(p.emoji, 0, 0)
        } else if (p.type === 'star') {
          ctx.fillStyle = p.color
          drawStar(ctx, 0, 0, p.size / 2, p.size, 5)
          ctx.fill()
        } else {
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }
      particlesRef.current = alive
      if (alive.length > 0) {
        animFrameRef.current = requestAnimationFrame(loop)
      } else {
        activeRef.current = false
      }
    }
    animFrameRef.current = requestAnimationFrame(loop)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  useEffect(() => {
    if (!confettiTrigger) return
    spawnParticles(confettiTrigger.style, 100)
  }, [confettiTrigger, spawnParticles])

  // Initial page load confetti
  useEffect(() => {
    const t = setTimeout(() => spawnParticles('saffron', 60), 2000)
    return () => clearTimeout(t)
  }, [spawnParticles])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 90,
      }}
    />
  )
}

function drawStar(ctx, cx, cy, outerR, innerR, points) {
  let rot = (-Math.PI / 2)
  const step = Math.PI / points
  ctx.beginPath()
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR
    ctx.lineTo(cx + Math.cos(rot) * r, cy + Math.sin(rot) * r)
    rot += step
  }
  ctx.closePath()
}
