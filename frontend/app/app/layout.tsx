'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { authService } from '@/lib/services/auth'
import { AppLayout as AppLayoutComponent } from '@/components/layout/app-layout'

export const dynamic = 'force-dynamic'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const publicClientRoute = pathname === '/app/map'

    if (publicClientRoute) {
      setIsAuthenticated(true)
      return
    }

    if (!authService.isAuthenticated()) {
      router.push('/auth')
    } else {
      setIsAuthenticated(true)
    }
  }, [pathname, router])

  if (!mounted || !isAuthenticated) {
    return null
  }

  return <AppLayoutComponent>{children}</AppLayoutComponent>
}

