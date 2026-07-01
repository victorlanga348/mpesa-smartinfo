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
    const publicClientRoute = ['/app/map', '/app/help', '/app/calculator'].includes(pathname)

    if (publicClientRoute) {
      setIsAuthenticated(true)
      return
    }

    if (!authService.isAuthenticated()) {
      router.replace('/auth')
    } else {
      setIsAuthenticated(true)
    }
  }, [pathname, router])

  if (!mounted || !isAuthenticated) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-background px-4 text-center"
        role="status"
        aria-live="polite"
      >
        <p className="text-sm font-medium text-muted-foreground">
          A validar acesso...
        </p>
      </div>
    )
  }

  return <AppLayoutComponent>{children}</AppLayoutComponent>
}

