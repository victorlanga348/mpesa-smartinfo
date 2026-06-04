'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogOut, Users, TrendingUp, Clock, Star, MapPin, Check, X, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { agentService, requestService } from '@/lib/services'
import { Agent } from '@/lib/types'

export default function AgentDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [agent, setAgent] = useState<Agent | null>(null)
  const [stats, setStats] = useState({
    totalRequests: 0,
    completedToday: 0,
    earnings: 0,
    rating: 0,
  })
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [referenceInput, setReferenceInput] = useState('')
  const [activeRequests, setActiveRequests] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const userData = localStorage.getItem('smartinfo_user')
    if (!userData) {
      router.push('/login')
    } else {
      setUser(JSON.parse(userData))
      loadAgentData()
    }
  }, [mounted, router])

  const loadAgentData = async () => {
    setLoading(true)
    try {
      const agents = await agentService.getAllAgents()
      if (agents.length > 0) {
        setAgent(agents[0])
        setReferenceInput(agents[0].location || '')
        setStats({
          totalRequests: agents[0].totalRequests,
          completedToday: 12,
          earnings: 3500,
          rating: agents[0].rating,
        })
      }

      const stored = localStorage.getItem('smartinfo_requests')
      const localRequests = stored ? JSON.parse(stored) : []
      const visibleRequests = localRequests.filter((request: any) => (
        (!request.agentId || !agents[0]?.id || request.agentId === agents[0].id) &&
        !['rejected', 'completed', 'arrived'].includes(request.status)
      ))
      const demoRequests = [
        { id: 'req-1', customerName: 'Joao Mabote', type: 'withdrawal', amount: 1500, status: 'pending', waitMinutes: 10 },
        { id: 'req-2', customerName: 'Maria Mandlate', type: 'deposit', amount: 3000, status: 'pending', waitMinutes: 15 }
      ]
      const requestsToShow = visibleRequests.length > 0 ? visibleRequests : demoRequests
      setActiveRequests(requestsToShow)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (newStatus: 'online' | 'offline' | 'busy') => {
    if (!agent) return
    try {
      await agentService.updateStatus(newStatus)
      setAgent({ ...agent, status: newStatus })
    } catch (e) {
      // Offline mode backup
      setAgent({ ...agent, status: newStatus })
    }
  }

  const handleUpdateReference = async () => {
    if (!agent) return
    try {
      await agentService.updateReference(referenceInput)
      setAgent({ ...agent, location: referenceInput })
      alert('Referência atualizada com sucesso!')
    } catch (e) {
      setAgent({ ...agent, location: referenceInput })
      alert('Referência salva localmente!')
    }
  }

  const handleAcceptRequest = async (id: string) => {
    const updateRequests = () => {
      const stored = localStorage.getItem('smartinfo_requests')
      const allRequests = stored ? JSON.parse(stored) : activeRequests
      const updated = allRequests.map((r: any) => r.id === id ? { ...r, status: 'accepted' } : r)
      localStorage.setItem('smartinfo_requests', JSON.stringify(updated))
      return updated.filter((r: any) => !['rejected', 'completed', 'arrived'].includes(r.status))
    }

    try {
      await requestService.acceptPing(id)
      setActiveRequests(updateRequests())
    } catch {
      setActiveRequests(updateRequests())
    }
  }

  const handleRejectRequest = async (id: string) => {
    const rejectRequest = () => {
      const stored = localStorage.getItem('smartinfo_requests')
      const allRequests = stored ? JSON.parse(stored) : activeRequests
      const updated = allRequests.map((r: any) => r.id === id ? { ...r, status: 'rejected' } : r)
      localStorage.setItem('smartinfo_requests', JSON.stringify(updated))
      return updated.filter((r: any) => !['rejected', 'completed', 'arrived'].includes(r.status))
    }

    try {
      await requestService.updatePingStatus(id, 'REJECTED')
      setActiveRequests(rejectRequest())
    } catch {
      setActiveRequests(rejectRequest())
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('smartinfo_user')
    router.push('/login')
  }

  if (!mounted) return null

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </main>
    )
  }

  if (!user || !agent) return null

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-gray-200 p-4 sticky top-0 z-50"
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Dashboard de Agente</h1>
            <p className="text-sm text-gray-600">Bem-vindo, {agent.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </motion.header>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-4 pb-20">
        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-6 space-y-4"
        >
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Seu Status Comercial</h2>
              <p className="text-xs text-gray-500">Controle a visibilidade no mapa</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleUpdateStatus('online')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  agent.status === 'online'
                    ? 'bg-green-500 border-green-500 text-white shadow-sm'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Online
              </button>
              <button
                onClick={() => handleUpdateStatus('busy')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  agent.status === 'busy'
                    ? 'bg-yellow-500 border-yellow-500 text-white shadow-sm'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Ocupado
              </button>
              <button
                onClick={() => handleUpdateStatus('offline')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  agent.status === 'offline'
                    ? 'bg-gray-500 border-gray-500 text-white shadow-sm'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Offline
              </button>
            </div>
          </div>

          {/* Reference Location Updater */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-red-500" />
              Referência Humana da Localização
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={referenceInput}
                onChange={(e) => setReferenceInput(e.target.value)}
                placeholder="Ex: Em frente ao mercado, ao lado da banca azul"
                className="flex-1 px-3 py-2 border rounded-lg text-sm text-gray-900 focus:outline-none focus:border-red-500"
              />
              <Button onClick={handleUpdateReference} className="bg-red-600 hover:bg-red-700 text-white text-xs">
                Guardar
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Incoming Client Pings */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Pedidos de Disponibilidade (Pings)</h3>
            <button onClick={loadAgentData} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
              <RefreshCw className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {activeRequests.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">Nenhum pedido ativo de momento.</p>
          ) : (
            <div className="space-y-4">
              {activeRequests.map((req) => (
                <div key={req.id} className="border border-gray-150 rounded-xl p-4 flex justify-between items-center bg-gray-50/50">
                  <div className="space-y-1">
                    <p className="font-bold text-gray-900 text-sm">{req.customerName}</p>
                    <p className="text-xs text-gray-600">
                      Operação: <span className="font-semibold">{req.type === 'withdrawal' ? 'Levantamento' : 'Depósito'}</span>
                    </p>
                    <p className="text-xs text-gray-600">
                      Valor: <span className="font-semibold text-red-600">{req.amount} MT</span>
                    </p>
                    <p className="text-xs text-gray-600">
                      Espera reservada: <span className="font-semibold">{req.waitMinutes || 10} min</span>
                    </p>
                    {req.status === 'accepted' && (
                      <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                        Aceite - aguardando cliente
                      </span>
                    )}
                    {req.status === 'customer_on_way' && (
                      <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded-full">
                        Cliente a caminho
                      </span>
                    )}
                  </div>
                  
                  {req.status === 'pending' && (
                    <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptRequest(req.id)}
                          className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                        >
                          <Check className="w-4 h-4" /> Disponivel
                        </button>
                        <button
                          onClick={() => handleRejectRequest(req.id)}
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                        >
                          <X className="w-4 h-4" /> Nao
                        </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <p className="text-xs text-gray-500 font-semibold">Total Atendimentos</p>
            </div>
            <p className="text-xl font-bold text-gray-900">{stats.totalRequests}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-green-600" />
              <p className="text-xs text-gray-500 font-semibold">Atendidos Hoje</p>
            </div>
            <p className="text-xl font-bold text-gray-900">{stats.completedToday}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-red-600" />
              <p className="text-xs text-gray-500 font-semibold">Ganhos Estimados (Hoje)</p>
            </div>
            <p className="text-xl font-bold text-gray-900">{stats.earnings} MT</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <p className="text-xs text-gray-500 font-semibold">Pontuação Média</p>
            </div>
            <p className="text-xl font-bold text-gray-900">{stats.rating.toFixed(1)} / 5.0</p>
          </div>
        </div>
      </div>
    </main>
  )
}
