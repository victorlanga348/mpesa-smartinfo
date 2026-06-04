'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { MouseEvent, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeLink, setActiveLink] = useState('')

  const navLinks = [
    { href: '#como-usar', label: 'Como usar' },
    { href: '#poupanca', label: 'Poupanca' },
    { href: '#agentes', label: 'Agentes' },
    { href: '/help', label: 'Ajuda' },
  ]

  const handleSectionClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) {
      setIsOpen(false)
      return
    }

    event.preventDefault()
    setActiveLink(href)
    setIsOpen(false)

    const section = document.querySelector(href)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.history.pushState(null, '', href)
    }
  }

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-red-100/70 bg-white/90 shadow-sm backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-sm font-black text-white shadow-md shadow-red-600/20">
              M
            </div>
            <span className="hidden text-lg font-black text-foreground sm:inline">m-pesa smartinfo</span>
          </Link>

          <div className="hidden items-center rounded-full border border-gray-200 bg-gray-50/80 p-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(event) => handleSectionClick(event, link.href)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-primary hover:shadow-sm ${
                  activeLink === link.href ? 'bg-white text-primary shadow-sm' : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Button asChild variant="outline" className="rounded-full border-red-200 px-5 text-primary">
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild className="rounded-full bg-primary px-5 text-white shadow-md shadow-red-600/20 hover:bg-red-700">
              <Link href="/map">Procurar agente</Link>
            </Button>
          </div>

          <button
            onClick={() => setIsOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm transition-colors hover:border-red-200 hover:bg-red-50 md:hidden"
            aria-label="Abrir menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="md:hidden"
            >
              <div className="mb-4 rounded-lg border border-gray-200 bg-white p-2 shadow-xl">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block rounded-md px-4 py-3 text-sm font-semibold transition-all duration-300 hover:bg-red-50 hover:text-primary ${
                      activeLink === link.href ? 'bg-red-50 text-primary' : 'text-gray-700'
                    }`}
                    onClick={(event) => handleSectionClick(event, link.href)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-2 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
                  <Button asChild variant="outline" className="rounded-full border-red-200 text-primary">
                    <Link href="/login">Entrar</Link>
                  </Button>
                  <Button asChild className="rounded-full bg-primary text-white hover:bg-red-700">
                    <Link href="/map">Procurar</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
