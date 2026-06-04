'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle, Clock, MapPin, Radio } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { useGeolocation } from '@/hooks/use-geolocation'
import { useSocket } from '@/hooks/use-socket'
import { agentService } from '@/lib/services/agent'
import { authService } from '@/lib/services/auth'
import { authHeaders, getApiUrl } from '@/lib/socket'
import { Agent, Request } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default function AgentDashboardPage() {
  const router = useRouter()
  const user = authService.getCurrentUser()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [serviceEnabled, setServiceEnabled] = useState(false)
  const { socket, state: socketState } = useSocket()

  const handleAgentLocation = useCallback(async ({ latitude, longitude }: { latitude: number; longitude: number }) => {
    if (!agent) return

    try {
      const updated = await agentService.updateAgentLocation(latitude, longitude)
      if (updated) setAgent(updated)
      socket.emit('agent:location-update', { agentId: agent.id, latitude, longitude })
    } catch (error) {
      console.error('Failed to update agent location:', error)
    }
  }, [agent, socket])

  const { error: locationError } = useGeolocation({
    enabled: serviceEnabled,
    watch: true,
    minDistanceMeters: 20,
    minIntervalMs: 7000,
    onLocation: handleAgentLocation,
  })

  useEffect(() => {
    if (!user || user.role !== 'agent') {
      router.push('/auth')
      return
    }

    const loadData = async () => {
      try {
        const agents = await agentService.getAgents()
        const currentAgent = agents.find((item) => item.id === user.id || item.phone === user.phone)

        if (currentAgent) {
          setAgent(currentAgent)
          socket.emit('join:agent', currentAgent.id)
        }

        const response = await fetch(`${getApiUrl()}/ping/active`, { headers: authHeaders() })
        const activePings = await response.json()

        if (Array.isArray(activePings)) {
          setRequests(activePings.filter((ping: any) => ping.agentId === (currentAgent?.id || user.id)).map(mapPingToRequest))
        }
      } catch (error) {
        console.error('Failed to load agent dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router, socket, user])

  useEffect(() => {
    if (!agent) return

    socket.emit('join:agent', agent.id)

    const upsertRequest = (ping: any) => {
      setRequests((current) => {
        const next = mapPingToRequest(ping)
        const exists = current.some((request) => request.id === next.id)
        return exists ? current.map((request) => request.id === next.id ? { ...request, ...next } : request) : [next, ...current]
      })
    }
    const removeRequest = (ping: any) => {
      setRequests((current) => current.filter((request) => request.id !== ping.id))
    }

    socket.on('ping:created', upsertRequest)
    socket.on('ping:accepted', upsertRequest)
    socket.on('ping:on-the-way', upsertRequest)
    socket.on('ping:arrived', removeRequest)
    socket.on('ping:expired', removeRequest)

    return () => {
      socket.off('ping:created', upsertRequest)
      socket.off('ping:accepted', upsertRequest)
      socket.off('ping:on-the-way', upsertRequest)
      socket.off('ping:arrived', removeRequest)
      socket.off('ping:expired', removeRequest)
    }
  }, [agent, socket])

  const toggleStatus = async (newStatus: 'online' | 'offline' | 'busy') => {
    if (!agent) return

    setServiceEnabled(newStatus !== 'offline')

    try {
      const updated = await agentService.updateAgentStatus(agent.id, newStatus)
      if (updated) setAgent(updated)
      socket.emit('agent:status-update', {
        agentId: agent.id,
        status: newStatus === 'online' ? 'ONLINE' : newStatus === 'busy' ? 'ON_MY_WAY' : 'OFFLINE',
      })
    } catch (error) {
      console.error('Failed to update agent status:', error)
    }
  }

  const acceptRequest = async (requestId: string) => {
    try {
      const response = await fetch(`${getApiUrl()}/ping/${requestId}/accept`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
      })
      const ping = await response.json()
      if (!response.ok) throw new Error(ping.error || 'Erro ao aceitar pedido')
      setRequests((current) => current.map((request) => request.id === requestId ? mapPingToRequest(ping) : request))
    } catch (error) {
      console.error('Failed to accept request:', error)
    }
  }

  if (loading) {
    return <PageMessage text="A carregar painel do agente..." />
  }

  if (!agent) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Painel do agente</h1>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-800">Perfil de agente nao encontrado. Confirme o telefone usado no login.</p>
        </div>
      </div>
    )
  }

  const pendingRequests = requests.filter((request) => request.status === 'pending').length
  const clientsOnWay = requests.filter((request) => request.status === 'confirmed').length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Painel do agente</h1>
        <p className="mt-2 text-gray-600">Controle o estado de servico e responda aos pedidos pendentes.</p>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Estado operacional</h2>
        <div className="mb-4 rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm text-gray-700">
          Tempo real: <strong>{socketState === 'online' ? 'online' : socketState === 'reconnecting' ? 'reconectando' : 'offline'}</strong>
          {locationError && <p className="mt-1 text-red-700">{locationError}</p>}
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{agent.name}</h3>
            <p className="text-gray-600">{agent.location}</p>
            <p className="mt-2 text-sm text-gray-500">A localizacao actualiza enquanto estiver em servico.</p>
          </div>
          <StatusBadge status={agent.status as any} />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => toggleStatus('online')} variant={agent.status === 'online' ? 'default' : 'outline'} className={agent.status === 'online' ? 'bg-[#16A34A] text-white hover:bg-green-700' : ''}>
            Estou em servico
          </Button>
          <Button onClick={() => toggleStatus('busy')} variant={agent.status === 'busy' ? 'default' : 'outline'} className={agent.status === 'busy' ? 'bg-[#F59E0B] text-white hover:bg-yellow-600' : ''}>
            Com cliente
          </Button>
          <Button onClick={() => toggleStatus('offline')} variant={agent.status === 'offline' ? 'default' : 'outline'} className={agent.status === 'offline' ? 'bg-[#9CA3AF] text-white hover:bg-gray-600' : ''}>
            Offline
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard icon={Radio} label="Estado" value={agent.status === 'online' ? 'Em servico' : agent.status === 'busy' ? 'Com cliente' : 'Offline'} />
        <MetricCard icon={CheckCircle} label="Clientes a caminho" value={clientsOnWay.toString()} />
        <MetricCard icon={Clock} label="Pedidos pendentes" value={pendingRequests.toString()} />
        <MetricCard icon={MapPin} label="Localizacao" value={agent.latitude && agent.longitude ? 'Activa' : 'Por definir'} />
      </section>

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">Pedidos pendentes</h2>
        </div>

        {requests.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className="mx-auto mb-3 size-12 text-gray-300" />
            <p className="text-gray-600">Ainda nao existem pedidos para este agente.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {requests.map((request) => (
              <div key={request.id} className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-gray-900">{operationLabel(request.type)}</p>
                    {request.amount && <p className="text-sm text-gray-600">Valor solicitado: {request.amount.toLocaleString('pt-MZ')} MT</p>}
                  </div>
                  <StatusBadge status={request.status as any} />
                </div>
                {request.status === 'pending' && (
                  <Button onClick={() => acceptRequest(request.id)} className="mt-3 bg-[#16A34A] text-white hover:bg-green-700">
                    Aceitar pedido
                  </Button>
                )}
                {request.status === 'confirmed' && (
                  <p className="mt-3 rounded-lg bg-blue-50 p-3 text-sm font-medium text-blue-800">
                    Cliente confirmou que esta a caminho. Quando tocar em Ja cheguei, sai automaticamente desta lista.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Actividade em tempo real</h2>
          <Radio className="size-5 text-[#E60000]" />
        </div>
        <p className="text-sm text-gray-600">
          Os dados serao apresentados quando houver actividade suficiente. O SmartInfo nao mostra saldo nem liquidez total do agente.
        </p>
      </section>
    </div>
  )
}

function MetricCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <Icon className="size-8 text-[#E60000]/30" />
      </div>
    </div>
  )
}

function PageMessage({ text }: { text: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>{text}</p>
    </div>
  )
}

function operationLabel(type: Request['type']) {
  if (type === 'withdrawal') return 'Levantamento'
  if (type === 'deposit') return 'Deposito'
  if (type === 'payment') return 'Pagamento'
  return 'Informacao'
}

function mapPingToRequest(ping: any): Request {
  const status = String(ping.status || '').toUpperCase()

  return {
    id: ping.id,
    customerId: ping.userId,
    agentId: ping.agentId,
    type: ping.operationType || 'withdrawal',
    amount: ping.amount,
    status: status === 'ACCEPTED' || status === 'ON_MY_WAY' ? 'confirmed' : 'pending',
    createdAt: ping.createdAt ? new Date(ping.createdAt) : new Date(),
  } as Request
}
