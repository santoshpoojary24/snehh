import React, { createContext, useContext, useState, useCallback } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [activeSection, setActiveSection] = useState(0)
  const [audioState, setAudioState] = useState({
    playing: false,
    trackIndex: 0,
    volume: 0.7,
    expanded: false,
  })
  const [confettiTrigger, setConfettiTrigger] = useState(null)
  
  const [eggUnlocked, setEggUnlocked] = useState(
    () => localStorage.getItem('egg_unlocked') === 'true'
  )
  const [eggVisible, setEggVisible] = useState(false)
  
  const [constellationComplete, setConstellationComplete] = useState(
    () => localStorage.getItem('constellation_complete') === 'true'
  )
  
  const [toastMsg, setToastMsg] = useState(null)

  const fireConfetti = useCallback((style = 'default') => {
    setConfettiTrigger({ style, id: Date.now() })
  }, [])

  const showToast = useCallback((msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }, [])

  const unlockEgg = useCallback(() => {
    setEggUnlocked(true)
    setEggVisible(true)
    localStorage.setItem('egg_unlocked', 'true')
  }, [])

  const completeConstellation = useCallback(() => {
    setConstellationComplete(true)
    localStorage.setItem('constellation_complete', 'true')
  }, [])

  return (
    <AppContext.Provider value={{
      activeSection,
      setActiveSection,
      audioState,
      setAudioState,
      confettiTrigger,
      fireConfetti,
      eggUnlocked,
      eggVisible,
      setEggVisible,
      unlockEgg,
      constellationComplete,
      completeConstellation,
      toastMsg,
      showToast,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
