'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/services/auth'
import { Button } from '@/components/ui/button'
import { LogOut, Menu, X } from 'lucide-react'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const user = authService.getCurrentUser()

  const handleLogout = () => {
    authService.logout()
    router.push('/login')
  }

  if (!user) {
    return <>{children}</>
  }

  const navLinks = user.role === 'agent' ? [
    { href: '/app/agent-dashboard', label: 'Meu Painel' },
    { href: '/app/requests', label: 'Solicitações' },
    { href: '/app/messages', label: 'Mensagens' },
  ] : user.role === 'admin' ? [
    { href: '/app/admin-dashboard', label: 'Painel Admin' },
    { href: '/app/analytics', label: 'Analíticas' },
    { href: '/app/zones', label: 'Zonas Críticas' },
  ] : [
    { href: '/app/map', label: 'Encontrar Agentes' },
    { href: '/app/messages', label: 'Mensagens' },
    { href: '/app/calculator', label: 'Calculadora' },
  ]

  const navLinksWithHelp = [...navLinks, { href: '/app/help', label: 'Ajuda' }]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link href={user.role === 'agent' ? '/app/agent-dashboard' : user.role === 'admin' ? '/app/admin-dashboard' : '/app/map'} className="flex items-center gap-2">
              <div className="text-xl font-bold text-primary">m-pesa smartinfo</div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinksWithHelp.map((link) => (
                <Link key={link.href} href={link.href} className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-sm">
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-gray-500 text-xs">{user.phone}</p>
              </div>
              <button onClick={handleLogout} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Sair</span>
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden border-t border-gray-200 py-4 space-y-2">
              {navLinksWithHelp.map((link) => (
                <Link key={link.href} href={link.href} className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}
