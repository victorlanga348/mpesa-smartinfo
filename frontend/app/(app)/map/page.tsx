'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Home, LogOut, Menu, Wallet } from 'lucide-react'
import Link from 'next/link'
import { Agent } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AgentBottomSheet } from '@/components/map/agent-bottom-sheet'
import { SmartSavingsCalculator } from '@/components/calculator/smart-savings-calculator'

const MapView = dynamic(() => import('@/components/map/map-view').then((mod) => ({ default: mod.MapView })), {
  ssr: false,
  loading: () => <div className="flex h-full w-full items-center justify-center bg-gray-100">Carregando mapa...</div>,
})

export default function MapPage() {
  const router = useRouter()
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [needsClientInfo, setNeedsClientInfo] = useState(false)
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('smartinfo_user')
    if (!userData) {
      setNeedsClientInfo(true)
    } else {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleCreateClient = (event: React.FormEvent) => {
    event.preventDefault()
    if (!clientName.trim() || !clientPhone.trim()) return

    const newUser = {
      id: `customer-${Date.now()}`,
      name: clientName.trim(),
      phone: clientPhone.trim(),
      role: 'customer',
      type: 'customer',
      token: `demo-token-${Date.now()}`,
    }

    localStorage.setItem('smartinfo_user', JSON.stringify(newUser))
    setUser(newUser)
    setNeedsClientInfo(false)
  }

  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent)
    setIsBottomSheetOpen(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('smartinfo_user')
    router.push('/login')
  }

  return (
    <main className="min-h-screen w-full bg-gray-50">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-[1000] border-b border-red-100/70 bg-white/90 p-4 shadow-sm backdrop-blur-xl"
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 font-black text-white shadow-md shadow-red-600/20">
              M
            </div>
            <div>
              <h1 className="font-black text-gray-900">m-pesa smartinfo</h1>
              <p className="text-xs text-gray-600">
                {user?.name ? `Ola, ${user.name}` : 'Encontre agentes proximos'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowMenu((value) => !value)}
            className="relative grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white shadow-sm transition-colors hover:border-red-200 hover:bg-red-50"
            aria-label="Abrir menu"
          >
            <Menu className="h-6 w-6 text-gray-700" />

            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-12 z-[1200] min-w-52 rounded-lg border border-gray-200 bg-white p-1 shadow-xl"
              >
                <Link
                  href="/"
                  className="flex w-full items-center gap-2 rounded-md px-4 py-3 text-left text-sm font-semibold text-gray-700 transition-colors hover:bg-red-50 hover:text-primary"
                >
                  <Home className="h-4 w-4" />
                  Pagina inicial
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-md border-t border-gray-100 px-4 py-3 text-left text-sm font-semibold text-gray-700 transition-colors hover:bg-red-50 hover:text-primary"
                >
                  <LogOut className="h-4 w-4" />
                  Terminar sessao
                </button>
              </motion.div>
            )}
          </button>
        </div>
      </motion.header>

      <div className="mx-auto grid w-full max-w-7xl gap-5 px-3 py-4 sm:px-4 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start lg:px-6">
        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-3">
            <h2 className="text-base font-black text-gray-900 sm:text-lg">Mapa de agentes</h2>
            <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
              Pesquise uma zona, toque num agente e aguarde a confirmacao antes de sair.
            </p>
          </div>
          <div className="relative h-[58vh] min-h-[420px] w-full overflow-hidden lg:h-[calc(100vh-190px)] lg:min-h-[620px]">
            <MapView onAgentSelect={handleAgentSelect} />
          </div>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-800">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <span className="font-bold">Agentes disponiveis perto de si</span>
              </div>
              <p className="text-xs leading-relaxed text-gray-600">
                Clique em qualquer marcador para confirmar disponibilidade antes de se deslocar.
              </p>
            </div>
          </motion.div>

          <section>
            <div className="mb-4 rounded-lg border border-red-100 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-red-600 text-white">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-900">Teste quanto pode poupar</h2>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    Compare levantar dinheiro com pagar digitalmente antes de sair.
                  </p>
                </div>
              </div>
            </div>
            <SmartSavingsCalculator embedded />
          </section>
        </aside>
      </div>

      {needsClientInfo && (
        <div className="fixed inset-0 z-[2000] flex items-end justify-center bg-white/75 p-3 backdrop-blur-md sm:items-center">
          <form onSubmit={handleCreateClient} className="w-full rounded-t-2xl bg-white p-5 shadow-2xl sm:max-w-sm sm:rounded-lg">
            <h2 className="text-xl font-black text-gray-900">Identifique-se</h2>
            <p className="mt-1 text-sm text-gray-600">
              Para consultar um agente, informe apenas o seu nome e numero.
            </p>
            <div className="mt-5 space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Nome</label>
                <Input
                  value={clientName}
                  onChange={(event) => setClientName(event.target.value)}
                  placeholder="Maria Joaquina"
                  autoFocus
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Numero M-Pesa</label>
                <Input
                  type="tel"
                  value={clientPhone}
                  onChange={(event) => setClientPhone(event.target.value)}
                  placeholder="843456789"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={!clientName.trim() || !clientPhone.trim()}
              className="mt-5 w-full bg-red-600 text-white hover:bg-red-700"
            >
              Continuar
            </Button>
          </form>
        </div>
      )}

      <AgentBottomSheet
        agent={selectedAgent}
        isOpen={isBottomSheetOpen}
        onClose={() => {
          setIsBottomSheetOpen(false)
          setSelectedAgent(null)
        }}
        onRequestCreated={(request) => {
          console.log('Request created:', request)
        }}
      />
    </main>
  )
}
