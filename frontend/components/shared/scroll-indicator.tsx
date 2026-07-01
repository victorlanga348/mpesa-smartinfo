'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

const BOTTOM_THRESHOLD = 120

export function ScrollIndicator() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let frame = 0

    const updateVisibility = () => {
      const root = document.documentElement
      const scrollableHeight = root.scrollHeight - window.innerHeight
      const hasOverflow = scrollableHeight > 80
      const nearBottom = window.scrollY >= scrollableHeight - BOTTOM_THRESHOLD
      setVisible(hasOverflow && !nearBottom)
      frame = 0
    }

    const requestUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updateVisibility)
    }

    requestUpdate()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [pathname])

  if (!visible) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
      <div className="scroll-indicator-chip inline-flex items-center gap-1 rounded-full border border-red-100/80 bg-white/88 px-3 py-1.5 text-[11px] font-semibold text-foreground/70 shadow-sm backdrop-blur-md">
        <span>Deslize</span>
        <ChevronDown className="size-3.5 text-primary" aria-hidden="true" />
      </div>
    </div>
  )
}
