'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/services/auth'
import { agentService } from '@/lib/services/agent'
import { Agent, Request } from '@/lib/types'
import { CheckCircle, Clock, AlertCircle, DollarSign, Users, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'

export const dynamic = 'force-dynamic'

export default function AgentDashboardPage() {
  const router = useRouter()
  const user = authService.getCurrentUser()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'agent') {
      router.push('/auth')
      return
    }

    const loadData = async () => {
      try {
        // Find agent by user phone
        const agents = await agentService.getAgents()
        const userAgent = agents.find((a) => a.phone === user.phone)

        if (userAgent) {
          setAgent(userAgent)
        }

        // Load pending requests
        const stored = localStorage.getItem('smartinfo_requests')
        if (stored) {
          try {
            const allRequests = JSON.parse(stored)
            setRequests(allRequests.filter((r: Request) => r.status === 'pending' || r.status === 'confirmed'))
          } catch (e) {
            console.error('Failed to parse requests', e)
          }
        }
      } catch (err) {
        console.error('Failed to load data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user, router])

  const toggleStatus = async (newStatus: 'online' | 'offline' | 'busy') => {
    if (!agent) return

    try {
      const updated = await agentService.updateAgentStatus(agent.id, newStatus)
      if (updated) {
        setAgent(updated)
      }
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Painel do Agente</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Seu perfil de agente não foi encontrado</p>
        </div>
      </div>
    )
  }

  const confirmedRequests = requests.filter((r) => r.status === 'confirmed').length
  const pendingRequests = requests.filter((r) => r.status === 'pending').length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Meu Painel</h1>
        <p className="text-gray-600 mt-2">Gerencie seus clientes e solicitações</p>
      </div>

      {/* Status Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Seu Status</h2>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{agent.name}</h3>
            <p className="text-gray-600">{agent.location}</p>
            <p className="text-sm text-gray-500 mt-2">Tempo médio de resposta: {agent.responseTime}s</p>
          </div>
          <StatusBadge status={agent.status as any} />
        </div>

        {/* Status Buttons */}
        <div className="flex gap-3 mt-6">
          <Button
            onClick={() => toggleStatus('online')}
            variant={agent.status === 'online' ? 'default' : 'outline'}
            className={agent.status === 'online' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
          >
            Online
          </Button>
          <Button
            onClick={() => toggleStatus('busy')}
            variant={agent.status === 'busy' ? 'default' : 'outline'}
            className={agent.status === 'busy' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : ''}
          >
            Ocupado
          </Button>
          <Button
            onClick={() => toggleStatus('offline')}
            variant={agent.status === 'offline' ? 'default' : 'outline'}
            className={agent.status === 'offline' ? 'bg-gray-600 hover:bg-gray-700 text-white' : ''}
          >
            Offline
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Saldo Disponível</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {agent.balance?.toLocaleString('pt-MZ') || '0'} MZN
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-primary/30" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Solicitações Confirmadas</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{confirmedRequests}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500/30" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Solicitações Pendentes</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{pendingRequests}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500/30" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total de Clientes</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{agent.totalRequests}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500/30" />
          </div>
        </div>
      </div>

      {/* Pending Requests */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Solicitações Pendentes</h2>
        </div>

        {requests.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">Nenhuma solicitação pendente</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {requests.map((req) => (
              <div key={req.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {req.type === 'withdrawal'
                        ? 'Levantamento'
                        : req.type === 'deposit'
                          ? 'Depósito'
                          : req.type === 'payment'
                            ? 'Pagamento'
                            : 'Informação'}
                    </p>
                    {req.amount && (
                      <p className="text-sm text-gray-600">Valor: {req.amount.toLocaleString('pt-MZ')} MZN</p>
                    )}
                  </div>
                  <StatusBadge status={req.status as any} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Performance */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Performance</h2>
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">Avaliação</p>
              <p className="text-sm font-semibold text-gray-900">{agent.rating.toFixed(1)} / 5.0</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${(agent.rating / 5) * 100}%` }}
              />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {agent.totalRequests} transações atendidas com sucesso
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
