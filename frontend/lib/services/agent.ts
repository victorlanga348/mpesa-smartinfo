import { Agent, Request, Reservation, ApiAgent, ApiPing } from '../types'
import { MOCK_AGENTS } from '../mock-data'
import { authHeaders, getApiUrl } from '@/lib/socket'

const AGENTS_STORAGE_KEY = 'smartinfo_agents'

function normalizeAgent(agent: ApiAgent): Agent {
  const fallback = MOCK_AGENTS.find((item) => item.id === agent.id)
  const status = String(agent.status || fallback?.status || 'offline').toUpperCase()

  return {
    id: agent.id,
    name: agent.name || fallback?.name || 'Agente M-Pesa',
    phone: agent.phone || fallback?.phone || '',
    latitude: Number(agent.latitude ?? fallback?.latitude ?? -25.9692),
    longitude: Number(agent.longitude ?? fallback?.longitude ?? 32.5732),
    status: status === 'ONLINE' ? 'online' : status === 'ON_MY_WAY' ? 'busy' : 'offline',
    location: agent.reference || fallback?.location || 'Localizacao actual',
    rating: fallback?.rating ?? 4.7,
    responseTime: fallback?.responseTime ?? 25,
    totalRequests: fallback?.totalRequests ?? 0,
  }
}

async function apiRequest(path: string, options: RequestInit = {}) {
  const response = await fetch(`${getApiUrl()}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || `Erro na API: ${response.status}`)
  }

  return response.json()
}

export const agentService = {
  async getAgents(): Promise<Agent[]> {
    try {
      const agents = await apiRequest('/agent')
      if (Array.isArray(agents)) {
        return agents
          .filter((agent) => agent.latitude !== null && agent.longitude !== null)
          .map(normalizeAgent)
      }
    } catch (error) {
      console.warn('A usar agentes locais porque o backend nao respondeu:', error)
    }

    if (typeof window !== 'undefined') {
      const storedAgents = localStorage.getItem(AGENTS_STORAGE_KEY)
      if (storedAgents) {
        try {
          return JSON.parse(storedAgents)
        } catch {
          return MOCK_AGENTS
        }
      }
    }

    return MOCK_AGENTS
  },

  async getAgent(id: string): Promise<Agent | null> {
    const agents = await this.getAgents()
    return agents.find((agent) => agent.id === id) || null
  },

  async getNearbyAgents(lat: number, lng: number, radiusKm: number = 2): Promise<Agent[]> {
    const agents = await this.getAgents()
    return agents.filter((agent) => {
      const distance = calculateDistance(lat, lng, agent.latitude, agent.longitude)
      return distance <= radiusKm && agent.status !== 'offline'
    })
  },

  async updateAgentStatus(agentId: string, status: 'online' | 'offline' | 'busy'): Promise<Agent | null> {
    const backendStatus = status === 'online' ? 'ONLINE' : status === 'busy' ? 'ON_MY_WAY' : 'OFFLINE'

    try {
      const updated = await apiRequest('/agent/status', {
        method: 'PUT',
        body: JSON.stringify({ status: backendStatus }),
      })
      return normalizeAgent(updated)
    } catch (error) {
      const agents = await this.getAgents()
      const updatedAgents = agents.map((agent) => agent.id === agentId ? { ...agent, status } : agent)
      localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(updatedAgents))
      return updatedAgents.find((agent) => agent.id === agentId) || null
    }
  },

  async updateAgentLocation(latitude: number, longitude: number): Promise<Agent | null> {
    const updated = await apiRequest('/agent/location', {
      method: 'PUT',
      body: JSON.stringify({ latitude, longitude }),
    })
    return normalizeAgent(updated)
  },

  async updateAgentBalance(agentId: string): Promise<Agent | null> {
    return this.getAgent(agentId)
  },

  async createRequest(
    customerId: string,
    agentId: string,
    type: Request['type'],
    amount: number = 0,
    latitude: number = 0,
    longitude: number = 0,
  ): Promise<Request> {
    try {
      const ping = await apiRequest('/ping', {
        method: 'POST',
        body: JSON.stringify({
          latitude,
          longitude,
          agentId,
          amount,
          operationType: type,
        }),
      })

      return mapPingToRequest(ping)
    } catch {
      return {
        id: `req-${Date.now()}`,
        customerId,
        agentId,
        type,
        amount,
        status: 'pending',
        createdAt: new Date(),
      }
    }
  },

  async createReservation(requestId: string, agentId: string, customerId: string, eta: number): Promise<Reservation> {
    try {
      const ping = await apiRequest(`/ping/${requestId}`)
      return mapPingToReservation(ping, agentId, customerId, eta)
    } catch {
      return {
        id: `res-${Date.now()}`,
        requestId,
        agentId,
        customerId,
        eta,
        pickupReference: `MPESA-${Date.now().toString().slice(-6)}`,
        status: 'active',
        expiresAt: new Date(Date.now() + eta * 60 * 1000),
        createdAt: new Date(),
      }
    }
  },

  async getActiveReservations(customerId: string): Promise<Reservation[]> {
    try {
      const pings = await apiRequest('/ping/active')
      if (!Array.isArray(pings)) return []

      return pings
        .filter((ping) => ping.userId === customerId && ping.reservationExpires)
        .map((ping) => mapPingToReservation(ping, ping.agentId, customerId, 10))
    } catch {
      return []
    }
  },
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const radius = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return radius * c
}

function mapPingToRequest(ping: ApiPing): Request {
  const status = String(ping.status || '').toUpperCase()

  return {
    id: ping.id,
    customerId: ping.userId,
    agentId: ping.agentId,
    type: ping.operationType || 'info',
    amount: ping.amount,
    status: mapPingStatus(status),
    createdAt: ping.createdAt ? new Date(ping.createdAt) : new Date(),
  } as Request
}

function mapPingStatus(status: string): Request['status'] {
  if (status === 'ACCEPTED') return 'accepted'
  if (status === 'WAITING_LIST') return 'waiting_list'
  if (status === 'ARRIVED') return 'arrived'
  if (status === 'IN_SERVICE' || status === 'ON_MY_WAY') return 'in_service'
  if (status === 'COMPLETED') return 'completed'
  if (status === 'CANCELLED') return 'cancelled'
  if (status === 'REJECTED' || status === 'EXPIRED') return 'rejected'
  return 'pending'
}

function mapPingToReservation(ping: ApiPing, agentId: string, customerId: string, eta: number): Reservation {
  return {
    id: ping.id,
    requestId: ping.id,
    agentId: ping.agentId || agentId,
    customerId: ping.userId || customerId,
    eta,
    pickupReference: ping.reservationToken || `MPESA-${String(ping.id || Date.now()).slice(-6)}`,
    status: String(ping.status || '').toUpperCase() === 'COMPLETED' ? 'completed' : 'active',
    expiresAt: ping.reservationExpires ? new Date(ping.reservationExpires) : new Date(Date.now() + eta * 60 * 1000),
    createdAt: ping.createdAt ? new Date(ping.createdAt) : new Date(),
  }
}
