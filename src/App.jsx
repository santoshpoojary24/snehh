import React, { useState } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import { useSectionSnap } from './hooks/useSectionSnap'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import BouquetIntro from './components/BouquetIntro'

// Layout
import DoodleBG from './modules/00_DoodleBG/DoodleBG'
import ConfettiEngine from './components/layout/ConfettiEngine'
import SectionDots from './components/layout/SectionDots'
import MusicPlayer from './components/layout/MusicPlayer'

// Sections
import HeroSection from './modules/01_Hero/Hero'
import PhotoDumpSection from './modules/02_PhotoDump/PhotoDump'
import SinceYouSection from './modules/03_SinceYou/SinceYou'
import InsideJokesSection from './modules/04_InsideJokes/InsideJokes'
import AppreciationSection from './modules/05_Appreciation/Appreciation'
import ScratchCardSection from './modules/06_ScratchCard/ScratchCard'
import ConstellationSection from './modules/07_Constellation/ConstellationCanvas'
import LetterSection from './modules/08_Letter/Letter'

// UI
import Toast from './components/ui/Toast'
import EasterEgg from './modules/09_EasterEgg/EasterEgg'

function AppInner() {
  const { setAudioState } = useApp()
  const { play } = useAudioPlayer()
  useSectionSnap()
  // Show bouquet intro once per session
  const [showBouquet, setShowBouquet] = useState(
    () => sessionStorage.getItem('bouquet_seen') !== 'true'
  )
  const handleEnter = () => {
    sessionStorage.setItem('bouquet_seen', 'true')
    setShowBouquet(false)
    // Autoplay song immediately upon accepting the bouquet
    play()
  }

  return (
    <>
      {showBouquet && <BouquetIntro onEnter={handleEnter} />}
      {/* Fixed background layers */}
      <DoodleBG />
      <ConfettiEngine />
      <SectionDots />
      <MusicPlayer />
      <Toast />
      <EasterEgg />

      {/* Snap scroll container */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        <HeroSection />
        <PhotoDumpSection />
        <SinceYouSection />
        <InsideJokesSection />
        <AppreciationSection />
        <ScratchCardSection />
        <ConstellationSection />
        <LetterSection />
      </main>
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
