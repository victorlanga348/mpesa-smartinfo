import { Agent } from '../types'
import { MOCK_AGENTS } from '../mock-data'
import { authHeaders, getApiUrl } from '@/lib/socket'

const AGENTS_STORAGE_KEY = 'smartinfo_agents'

function normalizeAgent(agent: any): Agent {
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
