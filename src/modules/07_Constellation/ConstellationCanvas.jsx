import React, { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { CONSTELLATION } from '../../config/content'
import { useApp } from '../../context/AppContext'

const CONNECTION_DISTANCE = 45
const SNAP_DISTANCE = 80

export default function ConstellationSection() {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-20%' })
  
  const { fireConfetti, completeConstellation, constellationComplete } = useApp()
  const [activeNodes, setActiveNodes] = useState([])
  const [showComplete, setShowComplete] = useState(false)

  const gameState = useRef({
    stars: [],
    nodes: [],
    particles: [],
    lines: [],
    shootingStars: [],
    ripples: [],
    cursor: { x: -100, y: -100, isDown: false },
    completed: constellationComplete,
    time: 0,
    completionGlow: 0,
    auroraPhase: 0,
  })

  // Initialize
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const W = window.innerWidth > 390 ? 390 : window.innerWidth
    const H = window.innerHeight > 844 ? 844 : window.innerHeight
    canvas.width = W
    canvas.height = H

    const stars = []
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        size: Math.random() * 2 + 0.3,
        baseOpacity: Math.random() * 0.5 + 0.1,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.005,
        color: Math.random() > 0.85 ? '251,207,232' : '255,255,255'
      })
    }

    const cx = W / 2
    const cy = H / 2 - 20
    const nodes = [
      { id: 1, x: cx, y: cy + 120, text: CONSTELLATION.node3, active: false },
      { id: 2, x: cx - 80, y: cy + 20, text: "", active: false },
      { id: 3, x: cx - 60, y: cy - 60, text: CONSTELLATION.node1, active: false },
      { id: 4, x: cx, y: cy - 20, text: "", active: false },
      { id: 5, x: cx + 60, y: cy - 60, text: CONSTELLATION.node2, active: false },
      { id: 6, x: cx + 80, y: cy + 20, text: "", active: false },
    ]

    gameState.current.stars = stars
    gameState.current.nodes = nodes
    gameState.current.completed = constellationComplete

    if (constellationComplete) {
      nodes.forEach(n => n.active = true)
      setActiveNodes(nodes.map(n => n.id))
      setShowComplete(true)
      gameState.current.lines = [
        { p1: nodes[0], p2: nodes[1], progress: 1 },
        { p1: nodes[1], p2: nodes[2], progress: 1 },
        { p1: nodes[2], p2: nodes[3], progress: 1 },
        { p1: nodes[3], p2: nodes[4], progress: 1 },
        { p1: nodes[4], p2: nodes[5], progress: 1 },
        { p1: nodes[5], p2: nodes[0], progress: 1 },
      ]
      gameState.current.completionGlow = 1
    }
  }, [constellationComplete])

  // Reset for testing
  const resetConstellation = () => {
    localStorage.removeItem('constellation_complete')
    const state = gameState.current
    state.nodes.forEach(n => n.active = false)
    state.lines = []
    state.completed = false
    state.completionGlow = 0
    setActiveNodes([])
    setShowComplete(false)
  }

  // Handle tap on canvas — activate nearest node
  const handleTap = (e) => {
    const state = gameState.current
    if (state.completed) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const touch = e.touches ? e.changedTouches[0] : e
    const tapX = touch.clientX - rect.left
    const tapY = touch.clientY - rect.top

    // Find closest inactive node within tap range
    let closest = null
    let closestDist = 60 // generous tap radius
    state.nodes.forEach(node => {
      if (node.active) return
      const dx = tapX - node.x
      const dy = tapY - node.y
      const dist = Math.sqrt(dx*dx + dy*dy)
      if (dist < closestDist) { closestDist = dist; closest = node }
    })

    if (closest) {
      closest.active = true
      const activeCount = state.nodes.filter(n => n.active).length
      if (activeCount > 1) {
        const prevNode = state.nodes.filter(n => n.active)[activeCount - 2]
        state.lines.push({ p1: prevNode, p2: closest, progress: 0 })
      }
      // Ripple + burst
      state.ripples.push({ x: closest.x, y: closest.y, radius: 4, life: 1 })
      state.ripples.push({ x: closest.x, y: closest.y, radius: 4, life: 0.7 })
      for (let i = 0; i < 25; i++) {
        const angle = Math.random() * Math.PI * 2
        const spd = Math.random() * 5 + 1
        state.particles.push({ x: closest.x, y: closest.y, vx: Math.cos(angle)*spd, vy: Math.sin(angle)*spd, life: 1, color: Math.random() > 0.5 ? '#FBCFE8' : '#D97706' })
      }
      const actives = state.nodes.filter(n => n.active).map(n => n.id)
      setActiveNodes(actives)
      if (actives.length === state.nodes.length && !state.completed) {
        state.lines.push({ p1: state.nodes[state.nodes.length-1], p2: state.nodes[0], progress: 0 })
        state.completed = true
        setShowComplete(true)
        completeConstellation()
        fireConfetti('crimson')
        state.nodes.forEach(n => {
          for (let i = 0; i < 50; i++) {
            const angle = Math.random() * Math.PI * 2
            const spd = Math.random() * 10 + 2
            state.particles.push({ x: n.x, y: n.y, vx: Math.cos(angle)*spd, vy: Math.sin(angle)*spd, life: Math.random()*1.5+0.5, color: '#BE123C' })
          }
        })
      }
    }
  }

  // Game Loop
  useEffect(() => {
    if (!inView) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })

    const spawnShootingStar = (W, H) => {
      const side = Math.random()
      let x, y, angle
      if (side < 0.5) { x = Math.random() * W; y = 0; angle = Math.PI / 4 + Math.random() * 0.5 }
      else { x = 0; y = Math.random() * H * 0.5; angle = -0.2 + Math.random() * 0.4 }
      return { x, y, vx: Math.cos(angle) * 8, vy: Math.sin(angle) * 8, life: 1, tail: [] }
    }

    const loop = () => {
      const state = gameState.current
      state.time += 0.016
      state.auroraPhase += 0.008
      const W = canvas.width
      const H = canvas.height

      // 1. Sky Background
      const grad = ctx.createRadialGradient(W/2, H, 0, W/2, H, H * 1.3)
      grad.addColorStop(0, '#2D142C')
      grad.addColorStop(0.5, '#120510')
      grad.addColorStop(1, '#000000')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)

      // 2. Aurora Glow at bottom
      const auroraY = H * 0.75
      const auroraGrad = ctx.createLinearGradient(0, auroraY, 0, H)
      const auroraOpacity = (Math.sin(state.auroraPhase) * 0.03 + 0.05).toFixed(2)
      auroraGrad.addColorStop(0, `rgba(159,18,57,${auroraOpacity})`)
      auroraGrad.addColorStop(0.5, `rgba(109,40,217,${(auroraOpacity * 0.5).toFixed(2)})`)
      auroraGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = auroraGrad
      ctx.fillRect(0, auroraY, W, H - auroraY)

      // 3. Stars with occasional twinkle cross
      state.stars.forEach(star => {
        star.phase += star.speed
        const opacity = star.baseOpacity + Math.sin(star.phase) * 0.4
        if (opacity <= 0) return
        
        // Draw soft halo for bright stars instead of shadowBlur
        if (opacity > 0.7) {
          ctx.fillStyle = `rgba(${star.color}, 0.2)`
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2)
          ctx.fill()
        }
        
        ctx.fillStyle = `rgba(${star.color}, ${Math.max(0, opacity)})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
        // Rare sparkle cross on very bright stars
        if (opacity > 0.8 && star.size > 1.5) {
          ctx.strokeStyle = `rgba(${star.color}, ${opacity * 0.5})`
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(star.x - star.size * 3, star.y)
          ctx.lineTo(star.x + star.size * 3, star.y)
          ctx.moveTo(star.x, star.y - star.size * 3)
          ctx.lineTo(star.x, star.y + star.size * 3)
          ctx.stroke()
        }
      })

      // 4. Shooting Stars (spawn randomly)
      if (Math.random() < 0.004) {
        state.shootingStars.push(spawnShootingStar(W, H))
      }
      const aliveShoot = []
      state.shootingStars.forEach(s => {
        s.tail.unshift({ x: s.x, y: s.y })
        if (s.tail.length > 18) s.tail.pop()
        s.x += s.vx
        s.y += s.vy
        s.life -= 0.025

        if (s.life > 0 && s.x < W + 50 && s.y < H + 50) {
          aliveShoot.push(s)
          // Draw tail
          s.tail.forEach((pt, i) => {
            const alpha = (1 - i / s.tail.length) * s.life * 0.8
            ctx.strokeStyle = `rgba(255,255,255,${alpha})`
            ctx.lineWidth = (1 - i / s.tail.length) * 2
            if (i === 0) { ctx.beginPath(); ctx.moveTo(pt.x, pt.y) }
            else ctx.lineTo(pt.x, pt.y)
          })
          ctx.stroke()
          
          // Head glow fallback
          ctx.fillStyle = `rgba(255,255,255,0.2)`
          ctx.beginPath()
          ctx.arc(s.x, s.y, 6, 0, Math.PI * 2)
          ctx.fill()
          
          // Core
          ctx.fillStyle = `rgba(255,255,255,${s.life})`
          ctx.beginPath()
          ctx.arc(s.x, s.y, 2, 0, Math.PI * 2)
          ctx.fill()
        }
      })
      state.shootingStars = aliveShoot

      // 5. Heart glow fill
      if (state.completed && state.completionGlow < 1) state.completionGlow += 0.015
      if (state.completed && state.completionGlow > 0) {
        const pulse = Math.sin(state.time * 1.5) * 0.04 + state.completionGlow * 0.15
        ctx.fillStyle = `rgba(159, 18, 57, ${pulse})`
        ctx.beginPath()
        ctx.moveTo(state.nodes[0].x, state.nodes[0].y)
        for (let i = 1; i < state.nodes.length; i++) ctx.lineTo(state.nodes[i].x, state.nodes[i].y)
        ctx.closePath()
        ctx.fill()
      }

      // 6. Ripple animations on node connect
      const aliveRipples = []
      state.ripples.forEach(r => {
        r.radius += 3
        r.life -= 0.04
        if (r.life > 0) {
          aliveRipples.push(r)
          ctx.strokeStyle = `rgba(251,207,232,${r.life * 0.6})`
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
          ctx.stroke()
        }
      })
      state.ripples = aliveRipples

      // 7. Lines with animated draw
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      state.lines.forEach(line => {
        if (line.progress < 1) {
          line.progress += 0.08
          if (line.progress > 1) line.progress = 1
        }
        const curX = line.p1.x + (line.p2.x - line.p1.x) * line.progress
        const curY = line.p1.y + (line.p2.y - line.p1.y) * line.progress
        const glowSize = state.completed ? 20 + Math.sin(state.time * 2) * 8 : 10
        ctx.strokeStyle = state.completed ? 'rgba(251,207,232,0.9)' : 'rgba(217,119,6,0.6)'
        ctx.lineWidth = state.completed ? 2.5 : 1.5
        
        // Draw underlying thicker translucent line instead of shadowBlur
        if (state.completed) {
           ctx.strokeStyle = 'rgba(251,207,232,0.2)'
           ctx.lineWidth = glowSize
           ctx.beginPath()
           ctx.moveTo(line.p1.x, line.p1.y)
           ctx.lineTo(curX, curY)
           ctx.stroke()
           
           ctx.strokeStyle = 'rgba(251,207,232,0.9)'
           ctx.lineWidth = 2.5
        }
        
        ctx.beginPath()
        ctx.moveTo(line.p1.x, line.p1.y)
        ctx.lineTo(curX, curY)
        ctx.stroke()
      })

      // 8. Cursor hover effect (no drag-to-connect, tap handles connection)
      const activeNodesList = state.nodes.filter(n => n.active)
      const lastActiveNode = activeNodesList.length > 0 ? activeNodesList[activeNodesList.length - 1] : null
      let targetNode = null

      if (!state.completed) {
        for (const node of state.nodes) {
          if (!node.active) {
            const dx = state.cursor.x - node.x
            const dy = state.cursor.y - node.y
            const dist = Math.sqrt(dx*dx + dy*dy)
            if (dist < SNAP_DISTANCE) {
              targetNode = node
              break
            }
          }
        }
        // Draw guide line from last active node to cursor or nearest node
        if (lastActiveNode) {
          const lx = targetNode ? targetNode.x : state.cursor.x
          const ly = targetNode ? targetNode.y : state.cursor.y
          ctx.strokeStyle = targetNode ? 'rgba(251,207,232,0.7)' : 'rgba(251,207,232,0.2)'
          ctx.lineWidth = targetNode ? 2 : 0.8
          ctx.setLineDash(targetNode ? [] : [4, 6])
          ctx.beginPath()
          ctx.moveTo(lastActiveNode.x, lastActiveNode.y)
          ctx.lineTo(lx, ly)
          ctx.stroke()
          ctx.setLineDash([])
        }
      }

      // 9. Nodes with animated rings
      state.nodes.forEach(node => {
        if (node.active) {
          const ringPulse = Math.sin(state.time * 3 + node.id) * 0.4 + 0.6
          ctx.strokeStyle = `rgba(251,207,232,${ringPulse * 0.4})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(node.x, node.y, 12 + ringPulse * 4, 0, Math.PI * 2)
          ctx.stroke()
          // Inner glow dot
          ctx.fillStyle = '#FBCFE8'
          ctx.beginPath()
          ctx.arc(node.x, node.y, 6 + Math.sin(state.time * 4) * 1, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // Pulsing inactive
          const pulse = Math.sin(state.time * 2 + node.id * 1.3) * 0.3 + 0.5
          ctx.fillStyle = `rgba(255,255,255,${pulse})`
          ctx.beginPath()
          ctx.arc(node.x, node.y, 3, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      // 11. Particles with screen blend
      const aliveP = []
      ctx.globalCompositeOperation = 'screen'
      state.particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.98
        p.vy *= 0.98
        p.life -= 0.015
        if (p.life > 0) {
          aliveP.push(p)
          ctx.globalAlpha = Math.min(1, Math.max(0, p.life))
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2)
          ctx.fill()
        }
      })
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
      state.particles = aliveP

      animRef.current = requestAnimationFrame(loop)
    }

    animRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animRef.current)
  }, [inView, completeConstellation, fireConfetti])

  const updateCursor = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const touch = e.touches ? e.touches[0] : e
    gameState.current.cursor.x = touch.clientX - rect.left
    gameState.current.cursor.y = touch.clientY - rect.top
  }

  const onMove = (e) => updateCursor(e)
  const onDown = (e) => { gameState.current.cursor.isDown = true; updateCursor(e) }
  const onUp = () => { gameState.current.cursor.isDown = false }

  return (
    <section className="section" id="constellation" data-section-index="6" ref={ref} style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <canvas
          ref={canvasRef}
          style={{ display: 'block', width: '100%', height: '100%', touchAction: 'none' }}
          onMouseMove={onMove}
          onClick={handleTap}
          onTouchEnd={handleTap}
        />

        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', padding: '48px 24px', zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
            style={{ textAlign: 'center' }}
          >
            <motion.h2
              animate={showComplete ? { scale: [1, 1.08, 1], textShadow: ['0 8px 30px rgba(0,0,0,0.9)', '0 0 30px rgba(251,207,232,0.8)', '0 8px 30px rgba(0,0,0,0.9)'] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                fontFamily: 'var(--font-display)',
                color: '#fff',
                fontSize: 32,
                fontWeight: 500,
                letterSpacing: '0.02em',
                textShadow: '0 8px 30px rgba(0,0,0,0.9), 0 0 10px rgba(251,207,232,0.4)',
              }}
            >
              The Constellation of Us
            </motion.h2>
            {!constellationComplete && (
              <motion.p
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ fontFamily: 'var(--font-hand)', color: 'var(--glow-blush)', fontSize: 22, marginTop: 12 }}
              >
                trace the stars...
              </motion.p>
            )}
            {showComplete && (
              <motion.p
                initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                style={{ fontFamily: 'var(--font-hand)', color: '#FBCFE8', fontSize: 20, marginTop: 12 }}
              >
                our love, written in the stars 🌹
              </motion.p>
            )}
          </motion.div>

          <AnimatePresence>
            {activeNodes.map((id) => {
              const node = gameState.current.nodes.find(n => n.id === id)
              if (!node || !node.text) return null
              let positionStyles = {}
              if (node.id === 1) {
                // Bottom tip: placed 35px below the star
                positionStyles = { top: node.y + 35, left: 24, right: 24, textAlign: 'center' }
              } else if (node.id === 3) {
                // Top left: placed 35px above the star
                positionStyles = { top: node.y - 35, left: 16, width: 140, textAlign: 'left', transform: 'translateY(-100%)' }
              } else if (node.id === 5) {
                // Top right: placed 35px above the star
                positionStyles = { top: node.y - 35, right: 16, width: 140, textAlign: 'right', transform: 'translateY(-100%)' }
              } else {
                positionStyles = { top: node.y, left: node.x }
              }

              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, scale: 0.9, y: 15, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
                  style={{ position: 'absolute', ...positionStyles }}
                >
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontSize: 17,
                    fontWeight: 500,
                    color: '#fff',
                    textShadow: '0 4px 16px rgba(0,0,0,0.9), 0 0 8px rgba(251,207,232,0.6)',
                    lineHeight: 1.5,
                  }}>
                    "{node.text}"
                  </p>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
