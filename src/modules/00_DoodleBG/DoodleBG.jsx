import React from 'react'

// Pure CSS keyframe animations — runs on compositor thread, NOT JS thread.
// This is the single biggest perf improvement for low-end phones.
const orbStyles = `
  @keyframes orbFloat1 {
    0%, 100% { transform: translate(0, 0) }
    50% { transform: translate(40px, -50px) }
  }
  @keyframes orbFloat2 {
    0%, 100% { transform: translate(0, 0) }
    50% { transform: translate(-30px, 40px) }
  }
  @keyframes orbFloat3 {
    0%, 100% { transform: translate(0, 0) }
    50% { transform: translate(50px, 30px) }
  }
  @keyframes orbFloat4 {
    0%, 100% { transform: translate(0, 0) }
    50% { transform: translate(-40px, -30px) }
  }
`

export default function DoodleBG() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden',
      background: 'radial-gradient(ellipse at bottom, rgba(136,19,55,0.04) 0%, transparent 60%)',
    }}>
      <style>{orbStyles}</style>

      {/* 4 static CSS-animated orbs instead of 15 JS-animated ones */}
      <div style={{
        position: 'absolute', width: 200, height: 200, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(136,19,55,0.12) 0%, transparent 70%)',
        top: '10%', left: '5%',
        animation: 'orbFloat1 20s ease-in-out infinite',
        willChange: 'transform',
      }} />
      <div style={{
        position: 'absolute', width: 160, height: 160, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(252,231,243,0.25) 0%, transparent 70%)',
        top: '50%', right: '5%',
        animation: 'orbFloat2 25s ease-in-out infinite',
        willChange: 'transform',
      }} />
      <div style={{
        position: 'absolute', width: 120, height: 120, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(136,19,55,0.1) 0%, transparent 70%)',
        bottom: '15%', left: '20%',
        animation: 'orbFloat3 18s ease-in-out infinite',
        willChange: 'transform',
      }} />
      <div style={{
        position: 'absolute', width: 100, height: 100, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(252,231,243,0.2) 0%, transparent 70%)',
        top: '25%', right: '25%',
        animation: 'orbFloat4 22s ease-in-out infinite',
        willChange: 'transform',
      }} />
    </div>
  )
}
