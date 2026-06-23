import React, { useState, lazy, Suspense } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import { useSectionSnap } from './hooks/useSectionSnap'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import BouquetIntro from './components/BouquetIntro'

// Layout (always needed — load eagerly)
import DoodleBG from './modules/00_DoodleBG/DoodleBG'
import ConfettiEngine from './components/layout/ConfettiEngine'
import SectionDots from './components/layout/SectionDots'
import MusicPlayer from './components/layout/MusicPlayer'
import Toast from './components/ui/Toast'

// Sections — lazy load all of them for faster initial boot
const HeroSection          = lazy(() => import('./modules/01_Hero/Hero'))
const PhotoDumpSection     = lazy(() => import('./modules/02_PhotoDump/PhotoDump'))
const SinceYouSection      = lazy(() => import('./modules/03_SinceYou/SinceYou'))
const InsideJokesSection   = lazy(() => import('./modules/04_InsideJokes/InsideJokes'))
const AppreciationSection  = lazy(() => import('./modules/05_Appreciation/Appreciation'))
const ScratchCardSection   = lazy(() => import('./modules/06_ScratchCard/ScratchCard'))
const ConstellationSection = lazy(() => import('./modules/07_Constellation/ConstellationCanvas'))
const LetterSection        = lazy(() => import('./modules/08_Letter/Letter'))
const EasterEgg            = lazy(() => import('./modules/09_EasterEgg/EasterEgg'))

// Minimal skeleton shown while a section loads
function SectionFallback() {
  return <div className="section" style={{ background: 'var(--bg-cream)' }} />
}

function AppInner() {
  const { setAudioState } = useApp()
  const { play } = useAudioPlayer()
  useSectionSnap()

  const [showBouquet, setShowBouquet] = useState(
    () => sessionStorage.getItem('bouquet_seen') !== 'true'
  )
  const handleEnter = () => {
    sessionStorage.setItem('bouquet_seen', 'true')
    setShowBouquet(false)
  }

  return (
    <>
      {showBouquet && <BouquetIntro onEnter={handleEnter} />}

      {/* Fixed background layers */}
      <DoodleBG />
      <ConfettiEngine />
      {!showBouquet && (
        <>
          <SectionDots />
          <MusicPlayer />
        </>
      )}
      <Toast />
      <Suspense fallback={null}>
        <EasterEgg />
      </Suspense>

      {/* Snap scroll container — each section lazy-loaded */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Suspense fallback={<SectionFallback />}><HeroSection /></Suspense>
        <Suspense fallback={<SectionFallback />}><PhotoDumpSection /></Suspense>
        <Suspense fallback={<SectionFallback />}><SinceYouSection /></Suspense>
        <Suspense fallback={<SectionFallback />}><InsideJokesSection /></Suspense>
        <Suspense fallback={<SectionFallback />}><AppreciationSection /></Suspense>
        <Suspense fallback={<SectionFallback />}><ScratchCardSection /></Suspense>
        <Suspense fallback={<SectionFallback />}><ConstellationSection /></Suspense>
        <Suspense fallback={<SectionFallback />}><LetterSection /></Suspense>
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
