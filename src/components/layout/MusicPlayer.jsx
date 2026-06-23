import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudioPlayer } from '../../hooks/useAudioPlayer'
import { useApp } from '../../context/AppContext'
import { PLAYLIST } from '../../config/content'

export default function MusicPlayer() {
  const { audioState, setAudioState } = useApp()
  const { play, pause, getCurrentTime, getDuration, seekTo } = useAudioPlayer()
  const track = PLAYLIST[audioState.trackIndex] || { title: 'no song yet', artist: 'fill playlist' }
  
  const [currentLyric, setCurrentLyric] = useState('')
  const [lyricOffset, setLyricOffset] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Sync lyrics loop
  useEffect(() => {
    if (!audioState.playing || !track.lyrics) return
    
    const interval = setInterval(() => {
      const time = getCurrentTime()
      const total = getDuration()
      
      setCurrentTime(time)
      if (total > 0) setDuration(total)

      // Find the last lyric whose time is <= (current time - offset)
      const activeLyric = [...track.lyrics].reverse().find(l => time >= (l.time + lyricOffset))
      if (activeLyric) {
        setCurrentLyric(activeLyric.text)
      }
    }, 250) // Check 4 times a second
    
    return () => clearInterval(interval)
  }, [audioState.playing, track, getCurrentTime, getDuration, lyricOffset])

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const handleSeek = (e) => {
    if (!duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percent = clickX / rect.width
    seekTo(percent * duration)
    setCurrentTime(percent * duration)
  }

  const toggle = () => {
    if (audioState.playing) pause()
    else play()
  }

  const toggleExpand = () => {
    setAudioState(s => ({ ...s, expanded: !s.expanded }))
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: `calc(16px + env(safe-area-inset-bottom, 0px))`,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 390,
      display: 'flex',
      justifyContent: 'center',
      zIndex: 150,
      pointerEvents: 'none',
    }}>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, type: 'spring', stiffness: 60, damping: 22, mass: 1.2 }}
        style={{
          width: audioState.expanded ? 340 : 220,
          maxWidth: 'calc(100% - 32px)',
          pointerEvents: 'auto',
        }}
      >
        <motion.div
        animate={{ height: audioState.expanded ? (track.lyrics ? 240 : 140) : 48 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        style={{
          background: 'var(--card-white)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--card-border)',
          borderRadius: audioState.expanded ? 20 : 999,
          overflow: 'hidden',
          boxShadow: '0 8px 32px var(--crimson-glow)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Collapsed pill row */}
        <div style={{
          height: 48,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 12px',
        }}>
          <button onClick={toggle} style={{ ...btnStyle, color: 'var(--accent-crimson)', fontSize: 18 }}>
            {audioState.playing ? '⏸' : '▶'}
          </button>
          <div
            onClick={toggleExpand}
            style={{
              flex: 1,
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            <div style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--text-main)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {track.title}
            </div>
          </div>

        </div>

        {/* Expanded section */}
        <AnimatePresence>
          {audioState.expanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}
            >
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text-main)', fontStyle: 'italic' }}>
                {track.title}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-main)', opacity: 0.6 }}>
                {track.artist}
              </div>
              
              {/* Fluid Wave Visualizer */}
              <div style={{
                height: 24,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginTop: 4,
              }}>
                {[...Array(24)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={audioState.playing ? {
                      height: [4, 18, 4, 24, 4],
                    } : { height: 4 }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.08,
                    }}
                    style={{
                      flex: 1,
                      background: 'var(--accent-amber)',
                      borderRadius: 999,
                      opacity: 0.5,
                    }}
                  />
                ))}
              </div>

              {/* Timeline / Progress Bar */}
              <div style={{ marginTop: 4, padding: '0 4px' }}>
                <div 
                  onClick={handleSeek}
                  style={{
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{
                    height: 4,
                    width: '100%',
                    background: 'rgba(127, 29, 29, 0.1)',
                    borderRadius: 2,
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                      background: 'var(--accent-crimson)',
                      borderRadius: 2,
                      transition: 'width 0.25s linear',
                    }} />
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: 'var(--text-main)',
                  opacity: 0.5,
                  marginTop: -4,
                }}>
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Lyrics Display */}
              {track.lyrics && (
                <div style={{
                  marginTop: 12,
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(127, 29, 29, 0.04)',
                  borderRadius: 12,
                  padding: '8px 12px',
                  position: 'relative',
                }}>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentLyric}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.6 }}
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 15,
                        fontStyle: 'italic',
                        color: 'var(--accent-crimson)',
                        textAlign: 'center',
                        lineHeight: 1.3,
                        margin: 0,
                      }}
                    >
                      {currentLyric || "Play the song..."}
                    </motion.p>
                  </AnimatePresence>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  )
}

const btnStyle = {
  background: 'none',
  border: 'none',
  fontSize: 16,
  cursor: 'pointer',
  padding: '4px 6px',
  minWidth: 32,
  minHeight: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--text-main)',
  borderRadius: 8,
}
