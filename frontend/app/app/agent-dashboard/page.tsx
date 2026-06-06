'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle, Clock, MapPin, Radio, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { useGeolocation } from '@/hooks/use-geolocation'
import { useSocket } from '@/hooks/use-socket'
import { agentService } from '@/lib/services/agent'
import { authService } from '@/lib/services/auth'
import { authHeaders, getApiUrl } from '@/lib/socket'
import { Agent, ApiPing, Request } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default function AgentDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(() => authService.getCurrentUser())
  const [agent, setAgent] = useState<Agent | null>(null)
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [serviceEnabled, setServiceEnabled] = useState(false)
  const [reference, setReference] = useState('')
  const [referenceSaving, setReferenceSaving] = useState(false)
  const { socket, state: socketState } = useSocket()
  const activeRequestsLoadingRef = useRef(false)

  const loadActiveRequests = useCallback(async (agentId: string) => {
    if (!agentId || activeRequestsLoadingRef.current) return

    activeRequestsLoadingRef.current = true
    try {
      const response = await fetch(`${getApiUrl()}/ping/active`, { headers: authHeaders() })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}))
        console.error('Failed to load active pings:', errorBody)
        return
      }

      const activePings = await response.json().catch(() => [])

      if (Array.isArray(activePings)) {
        setRequests(activePings
          .filter((ping: ApiPing) => ping.agentId === agentId)
          .map(mapPingToRequest))
      }
    } catch (error) {
      console.error(`Failed to fetch active pings from ${getApiUrl()}/ping/active:`, error)
    } finally {
      activeRequestsLoadingRef.current = false
    }
  }, [])

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
    setUser(authService.getCurrentUser())
  }, [])

  useEffect(() => {
    if (!user || user.role !== 'agent') {
      router.push('/auth')
      return
    }

    const loadData = async () => {
      try {
        const agents = await agentService.getAgents()
        const currentAgent = agents.find((item) => item.id === user.id)

        if (currentAgent) {
          setAgent(currentAgent)
          setReference(currentAgent.location === 'Localizacao actual' ? '' : currentAgent.location)
          setServiceEnabled(true)
          socket.emit('join:agent', currentAgent.id)
          await loadActiveRequests(currentAgent.id)
        }
      } catch (error) {
        console.error('Failed to load agent dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [loadActiveRequests, router, socket, user?.id, user?.role])

  useEffect(() => {
    if (!agent) return

    socket.emit('join:agent', agent.id)

    const upsertRequest = (ping: ApiPing) => {
      if (ping.agentId !== agent.id) return

      setRequests((current) => {
        const next = mapPingToRequest(ping)
        const exists = current.some((request) => request.id === next.id)
        return exists ? current.map((request) => request.id === next.id ? { ...request, ...next } : request) : [next, ...current]
      })
    }
    const removeRequest = (ping: ApiPing) => {
      setRequests((current) => current.filter((request) => request.id !== ping.id))
    }

    socket.on('ping:created', upsertRequest)
    socket.on('ping:accepted', upsertRequest)
    socket.on('ping:waiting-list', upsertRequest)
    socket.on('ping:in-service', upsertRequest)
    socket.on('ping:on-the-way', upsertRequest)
    socket.on('ping:arrived', removeRequest)
    socket.on('ping:cancelled', removeRequest)
    socket.on('ping:rejected', removeRequest)
    socket.on('ping:completed', removeRequest)
    socket.on('ping:expired', removeRequest)

    const interval = window.setInterval(() => {
      loadActiveRequests(agent.id).catch((error) => {
        console.error('Failed to refresh active requests:', error)
      })
    }, 5000)

    return () => {
      socket.off('ping:created', upsertRequest)
      socket.off('ping:accepted', upsertRequest)
      socket.off('ping:waiting-list', upsertRequest)
      socket.off('ping:in-service', upsertRequest)
      socket.off('ping:on-the-way', upsertRequest)
      socket.off('ping:arrived', removeRequest)
      socket.off('ping:cancelled', removeRequest)
      socket.off('ping:rejected', removeRequest)
      socket.off('ping:completed', removeRequest)
      socket.off('ping:expired', removeRequest)
      window.clearInterval(interval)
    }
  }, [agent, loadActiveRequests, socket])

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

  const saveReference = async () => {
    if (!agent || referenceSaving) return

    setReferenceSaving(true)
    try {
      const updated = await agentService.updateAgentReference(reference)
      if (updated) {
        setAgent(updated)
        setReference(updated.location === 'Localizacao actual' ? '' : updated.location)
      }
    } catch (error) {
      console.error('Failed to update agent reference:', error)
    } finally {
      setReferenceSaving(false)
    }
  }

  const rejectRequest = async (requestId: string) => {
    try {
      const response = await fetch(`${getApiUrl()}/ping/${requestId}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
      })
      const ping = await response.json()
      if (!response.ok) throw new Error(ping.error || 'Erro ao negar pedido')
      setRequests((current) => current.filter((request) => request.id !== requestId))
    } catch (error) {
      console.error('Failed to reject request:', error)
    }
  }

  const completeRequest = async (requestId: string) => {
    try {
      const response = await fetch(`${getApiUrl()}/ping/${requestId}/complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
      })
      const ping = await response.json()
      if (!response.ok) throw new Error(ping.error || 'Erro ao finalizar atendimento')
      setRequests((current) => current.filter((request) => request.id !== requestId))
    } catch (error) {
      console.error('Failed to complete request:', error)
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
          <p className="text-red-800">Perfil de agente nao encontrado. Confirme o nome e codigo usados no login.</p>
        </div>
      </div>
    )
  }

  const pendingList = requests.filter((request) => request.status === 'pending')
  const queueList = requests.filter((request) => ['accepted', 'waiting_list'].includes(request.status))
  const pendingRequests = pendingList.length
  const clientsOnWay = queueList.length
  const averageServiceTime = agent.averageServiceMinutes === null || agent.averageServiceMinutes === undefined
    ? 'Sem dados suficientes'
    : `${Math.round(agent.averageServiceMinutes)} min`

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
          <StatusBadge status={agent.status} />
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

        <div className="mt-6 rounded-lg border border-gray-100 bg-gray-50 p-4">
          <label htmlFor="agent-reference" className="block text-sm font-semibold text-gray-800">
            Localizacao especifica
          </label>
          <p className="mt-1 text-xs text-gray-500">
            Bairro, rua, referencia, agencia ou balcao. Opcional.
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              id="agent-reference"
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              maxLength={120}
              placeholder="Ex: Bairro Central, perto da banca azul"
              className="min-h-11 flex-1 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
            <Button onClick={saveReference} disabled={referenceSaving}>
              {referenceSaving ? 'A guardar...' : 'Guardar'}
            </Button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard icon={Radio} label="Estado" value={agent.status === 'online' ? 'Em servico' : agent.status === 'busy' ? 'Com cliente' : 'Offline'} />
        <MetricCard icon={CheckCircle} label="Clientes a caminho" value={clientsOnWay.toString()} />
        <MetricCard icon={Clock} label="Pedidos pendentes" value={pendingRequests.toString()} />
        <MetricCard icon={Clock} label="Tempo medio" value={averageServiceTime} />
        <MetricCard icon={MapPin} label="Localizacao" value={agent.latitude && agent.longitude ? 'Activa' : 'Por definir'} />
      </section>

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">Pedidos recebidos</h2>
        </div>

        {pendingList.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className="mx-auto mb-3 size-12 text-gray-300" />
            <p className="text-gray-600">Nao existem pedidos pendentes.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {pendingList.map((request) => (
              <div key={request.id} className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-gray-900">{operationLabel(request.type)}</p>
                    <p className="text-sm text-gray-600">Cliente: {request.customerName || 'Cliente'}</p>
                    {request.customerPhone && <p className="text-sm text-gray-500">Contacto: {request.customerPhone}</p>}
                    {request.amount && <p className="text-sm text-gray-600">Valor solicitado: {request.amount.toLocaleString('pt-MZ')} MT</p>}
                  </div>
                  <StatusBadge status={request.status} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button onClick={() => acceptRequest(request.id)} className="mt-3 bg-[#16A34A] text-white hover:bg-green-700">
                    Aceitar
                  </Button>
                  <Button onClick={() => rejectRequest(request.id)} variant="outline" className="mt-3 border-red-200 text-red-700 hover:bg-red-50">
                    Negar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">Clientes aceites / lista de espera</h2>
        </div>

        {queueList.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className="mx-auto mb-3 size-12 text-gray-300" />
            <p className="text-gray-600">Ainda nao existem clientes aceites.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {queueList.map((request) => (
              <div key={request.id} className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-gray-900">{request.customerName || 'Cliente'}</p>
                    {request.customerPhone && <p className="text-sm text-gray-500">Contacto: {request.customerPhone}</p>}
                    <p className="text-sm text-gray-600">{operationLabel(request.type)}{request.amount ? ` - ${request.amount.toLocaleString('pt-MZ')} MT` : ''}</p>
                  </div>
                  <StatusBadge status={request.status} />
                </div>
                {request.status === 'arrived' ? (
                  <p className="mt-3 rounded-lg bg-green-50 p-3 text-sm font-medium text-green-800">
                    Cliente marcou que chegou.
                  </p>
                ) : (
                  <p className="mt-3 rounded-lg bg-blue-50 p-3 text-sm font-medium text-blue-800">
                    Cliente aceite e em lista de espera.
                  </p>
                )}
                <Button onClick={() => completeRequest(request.id)} className="mt-3 bg-[#E60000] text-white hover:bg-red-700">
                  Finalizar/remover
                </Button>
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

function MetricCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
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

function mapPingToRequest(ping: ApiPing): Request {
  const status = String(ping.status || '').toUpperCase()

  return {
    id: ping.id,
    customerId: ping.userId,
    customerName: ping.user?.name || undefined,
    customerPhone: ping.user?.phone || undefined,
    agentId: ping.agentId,
    type: ping.operationType || 'withdrawal',
    amount: ping.amount,
    status: mapPingStatus(status),
    createdAt: ping.createdAt ? new Date(ping.createdAt) : new Date(),
  } as Request
}

function mapPingStatus(status: string): Request['status'] {
  if (status === 'ACCEPTED') return 'accepted'
  if (status === 'WAITING_LIST') return 'waiting_list'
  if (status === 'ARRIVED') return 'arrived'
  if (status === 'IN_SERVICE' || status === 'ON_MY_WAY') return 'accepted'
  if (status === 'COMPLETED') return 'completed'
  if (status === 'CANCELLED') return 'cancelled'
  if (status === 'REJECTED' || status === 'EXPIRED') return 'rejected'
  return 'pending'
}
