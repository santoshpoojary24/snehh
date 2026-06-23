import { useCallback } from 'react'
import { Howl } from 'howler'
import { useApp } from '../context/AppContext'
import { PLAYLIST } from '../config/content'

let howlInstance = null

export function useAudioPlayer() {
  const { audioState, setAudioState } = useApp()

  const getHowl = useCallback((index) => {
    const track = PLAYLIST[index]
    if (!track || !track.src) return null
    if (howlInstance) howlInstance.unload()
    howlInstance = new Howl({
      src: [track.src],
      html5: true,
      volume: audioState.volume,
      onend: () => {
        const next = (index + 1) % PLAYLIST.length
        setAudioState(s => ({ ...s, trackIndex: next, playing: false }))
      },
    })
    return howlInstance
  }, [audioState.volume, setAudioState])

  const play = useCallback(() => {
    const track = PLAYLIST[audioState.trackIndex]
    if (!track || !track.src) return
    if (!howlInstance) {
      getHowl(audioState.trackIndex)
    }
    if (howlInstance) { 
      howlInstance.play()
      setAudioState(s => ({ ...s, playing: true })) 
    }
  }, [audioState.trackIndex, getHowl, setAudioState])

  const pause = useCallback(() => {
    if (howlInstance) { 
      howlInstance.pause()
      setAudioState(s => ({ ...s, playing: false })) 
    }
  }, [setAudioState])

  const next = useCallback(() => {
    if (howlInstance) howlInstance.stop()
    const idx = (audioState.trackIndex + 1) % Math.max(PLAYLIST.length, 1)
    setAudioState(s => ({ ...s, trackIndex: idx, playing: false }))
  }, [audioState.trackIndex, setAudioState])

  const prev = useCallback(() => {
    if (howlInstance) howlInstance.stop()
    const idx = (audioState.trackIndex - 1 + Math.max(PLAYLIST.length, 1)) % Math.max(PLAYLIST.length, 1)
    setAudioState(s => ({ ...s, trackIndex: idx, playing: false }))
  }, [audioState.trackIndex, setAudioState])

  const getCurrentTime = useCallback(() => {
    if (howlInstance && howlInstance.playing()) {
      return howlInstance.seek()
    }
    return 0
  }, [])

  const getDuration = useCallback(() => {
    if (howlInstance) {
      return howlInstance.duration()
    }
    return 0
  }, [])

  const seekTo = useCallback((timeOrPercent) => {
    if (howlInstance) {
      howlInstance.seek(timeOrPercent)
    }
  }, [])

  return { audioState, play, pause, next, prev, getCurrentTime, getDuration, seekTo }
}
