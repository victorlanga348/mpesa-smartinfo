'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/services/auth'
import { AppLayout as AppLayoutComponent } from '@/components/layout/app-layout'

export const dynamic = 'force-dynamic'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!authService.isAuthenticated()) {
      router.push('/auth')
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  if (!mounted || !isAuthenticated) {
    return null
  }

  return <AppLayoutComponent>{children}</AppLayoutComponent>
}

