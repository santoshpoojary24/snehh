import { useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'

export function useSectionSnap(sectionCount = 9) {
  const { setActiveSection } = useApp()
  const observerRef = useRef(null)

  useEffect(() => {
    const sections = document.querySelectorAll('.section')
    if (!sections.length) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const idx = parseInt(entry.target.dataset.sectionIndex || '0', 10)
            setActiveSection(idx)
          }
        })
      },
      { threshold: 0.6 }
    )

    sections.forEach((sec) => observerRef.current.observe(sec))

    return () => {
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, [setActiveSection])
}
