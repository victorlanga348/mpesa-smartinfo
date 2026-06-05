import axios from 'axios'
import { Agent, Request, Message, Reservation, AdminMetrics, ApiAgent, ApiPing, LocalRequest } from '@/lib/types'
import { MOCK_AGENTS, CRITICAL_ZONES } from '@/lib/mock-data'
import { getApiUrl } from '@/lib/socket'
import { parseJson } from '@/lib/runtime'

const API = axios.create({
  baseURL: getApiUrl(),
})

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
    distanceKm: fallback?.distanceKm,
  }
}

// Inject token to requests if present
API.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('smartinfo_user')
    if (userStr) {
      const user = JSON.parse(userStr)
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`
      }
    }
  }
  return config
})

// Agent Service
export const agentService = {
  async getAllAgents(): Promise<Agent[]> {
    try {
      const response = await API.get('/agent')
      if (Array.isArray(response.data)) {
        return response.data
          .filter((agent) => agent.latitude !== null && agent.longitude !== null)
          .map(normalizeAgent)
      }
    } catch (e) {
      console.log('Error fetching agents, using mock data:', e)
    }

    return MOCK_AGENTS
  },

  async getNearbyAgents(lat: number, lng: number, radiusKm: number = 2): Promise<Agent[]> {
    try {
      const response = await API.get('/agent')
      if (Array.isArray(response.data)) {
        return response.data
          .filter((agent) => agent.latitude !== null && agent.longitude !== null)
          .map(normalizeAgent)
          .filter((agent) => agent.status !== 'offline')
      }
    } catch (e) {
      console.log('Error fetching active agents, using mock data:', e)
    }
    
    // Fallback/Simulated behavior:
    return MOCK_AGENTS.map(agent => ({
      ...agent,
      balance: undefined
    }))
  },

  async getAgentById(agentId: string) {
    try {
      const agent = MOCK_AGENTS.find((a) => a.id === agentId)
      if (agent) {
        return {
          ...agent,
          balance: undefined
        }
      }
    } catch (e) {
      console.error(e)
    }
    return null
  },

  async updateStatus(status: 'online' | 'offline' | 'busy') {
    try {
      const response = await API.put('/agent/status', { status: status.toUpperCase() })
      return response.data
    } catch {
      return { status }
    }
  },

  async updateLocation(lat: number, lng: number) {
    const response = await API.put('/agent/location', { latitude: lat, longitude: lng })
    return response.data
  },

  async updateReference(reference: string) {
    try {
      const response = await API.put('/agent/reference', { reference })
      return response.data
    } catch {
      return { reference }
    }
  },

  async pingAgent(agentId: string, amount: number, operationType: string = 'withdrawal', lat: number = 0, lng: number = 0) {
    const response = await API.post('/ping', {
      latitude: lat,
      longitude: lng,
      agentId,
      amount,
      operationType
    })
    return response.data
  }
}

// Request Service
export const requestService = {
  async createRequest(customerId: string, agentId: string, type: string, amount?: number, lat: number = 0, lng: number = 0) {
    const response = await API.post('/ping', {
      latitude: lat,
      longitude: lng,
      agentId,
      amount,
      operationType: type
    })
    return response.data
  },

  async confirmRequest(requestId: string) {
    try {
      const response = await API.put(`/ping/${requestId}/status`, { status: 'WAITING_LIST' })
      return response.data
    } catch {
      return { id: requestId, status: 'waiting_list' }
    }
  },

  async updatePingStatus(requestId: string, status: string) {
    try {
      const response = await API.put(`/ping/${requestId}/status`, { status })
      return response.data
    } catch {
      return { id: requestId, status }
    }
  },

  async cancelPing(requestId: string) {
    const response = await API.put(`/ping/${requestId}/cancel`)
    return response.data
  },

  async markArrived(requestId: string) {
    const response = await API.put(`/ping/${requestId}/arrive`)
    return response.data
  },

  async acceptPing(requestId: string) {
    try {
      const response = await API.put(`/ping/${requestId}/accept`)
      return response.data
    } catch {
      return { id: requestId, status: 'waiting_list' }
    }
  }
}

// Chat Service
export const chatService = {
  async getMessages(userId: string, otherUserId: string) {
    return [] as Message[]
  },

  async sendMessage(senderId: string, receiverId: string, text: string) {
    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId,
      receiverId,
      text,
      timestamp: new Date(),
      read: false,
    }
    return message
  },
}

// Reservation Service
export const reservationService = {
  async createReservation(customerId: string, agentId: string, requestId: string, eta: number): Promise<Reservation> {
    try {
      const response = await API.get(`/ping/${requestId}`)
      return {
        id: response.data.id,
        requestId: response.data.id,
        agentId: response.data.agentId,
        customerId: response.data.userId,
        eta,
        pickupReference: response.data.reservationToken || 'MPESA-XYZ123',
        status: 'active',
        expiresAt: response.data.reservationExpires ? new Date(response.data.reservationExpires) : new Date(Date.now() + eta * 60 * 1000),
        createdAt: new Date()
      }
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
        createdAt: new Date()
      }
    }
  }
}

// Admin Service
export const adminService = {
  async getDashboardMetrics(): Promise<AdminMetrics> {
    const getLocalMetrics = (): AdminMetrics => {
      const storedRequests = typeof window !== 'undefined' ? localStorage.getItem('smartinfo_requests') : null
      const requests = parseJson<LocalRequest[]>(storedRequests, [])
      const totalUsers = typeof window !== 'undefined' && localStorage.getItem('smartinfo_user') ? 1 : 0
      const successfulRequests = requests.filter((request) => request.status === 'completed' || request.status === 'arrived').length
      const failedRequests = requests.filter((request) => request.status === 'cancelled' || request.status === 'rejected').length

      return {
        totalUsers: Math.max(totalUsers, 1),
        totalAgents: MOCK_AGENTS.length,
        successfulRequests,
        failedRequests,
        avgResponseTime: Math.round(MOCK_AGENTS.reduce((sum, agent) => sum + agent.responseTime, 0) / MOCK_AGENTS.length),
        activeZones: CRITICAL_ZONES,
        requestsByType: {
          withdrawal: requests.filter((request) => request.type === 'withdrawal').length,
          deposit: requests.filter((request) => request.type === 'deposit').length,
          payment: requests.filter((request) => request.type === 'payment').length,
          info: requests.filter((request) => request.type === 'info').length,
        },
      }
    }

    try {
      const response = await API.get('/admin/stats')
      const data = response.data || {}
      const local = getLocalMetrics()

      return {
        totalUsers: data.totalUsers ?? local.totalUsers,
        totalAgents: data.totalAgents ?? local.totalAgents,
        successfulRequests: data.successfulRequests ?? data.completedPings ?? local.successfulRequests,
        failedRequests: data.failedRequests ?? Math.max(0, (data.totalPings ?? 0) - (data.completedPings ?? 0) - (data.pendingPings ?? 0)),
        avgResponseTime: data.avgResponseTime ?? local.avgResponseTime,
        activeZones: data.activeZones ?? local.activeZones,
        requestsByType: data.requestsByType ?? local.requestsByType,
      }
    } catch {
      return getLocalMetrics()
    }
  },

  async getHeatmapData() {
    return CRITICAL_ZONES.map((zone) => ({
      ...zone,
      requests: Math.floor(Math.random() * 100) + 10,
    }))
  },

  async getTopAgents() {
    return MOCK_AGENTS.sort((a, b) => b.rating - a.rating).slice(0, 5)
  },
}

// Authentication Service
export const authService = {
  // Cliente: registar com nome (recebe código)
  async registerClient(name: string, phone?: string) {
    const response = await API.post('/user/register', { name, phone })
    const data = response.data

    if (data?.token && data?.user) {
      localStorage.setItem('smartinfo_user', JSON.stringify({ ...data.user, token: data.token, role: 'customer', type: 'customer' }))
    }

    return data
  },

  // Cliente: login com nome + código
  async loginClient(name: string, code: string) {
    try {
      const response = await API.post('/user/login', { name, code })
      const { token, user } = response.data
      localStorage.setItem('smartinfo_user', JSON.stringify({ ...user, token, role: 'customer', type: 'customer' }))
      return response.data
    } catch (error) {
      localStorage.removeItem('smartinfo_user')
      throw error
    }
  },

  // Admin: login com email + senha
  async loginAdmin(email: string, password: string) {
    try {
      const response = await API.post('/admin/login', { email, password })
      const { token, user } = response.data
      localStorage.setItem('smartinfo_user', JSON.stringify({ ...user, token, role: 'admin', type: 'admin' }))
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Agente: login com telefone + senha (mantém igual)
  async loginAgent(name: string, code: string) {
    try {
      const response = await API.post('/agent/login', { name, code })
      const { token, agent } = response.data
      localStorage.setItem('smartinfo_user', JSON.stringify({ ...agent, token, role: 'agent', type: 'agent' }))
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Agente: registar
  async registerAgent(name: string, phone: string, code: string) {
    try {
      const response = await API.post('/agent/register', { name, phone, code })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Legacy methods for backward compatibility
  async register(name: string, phone: string, neighborhood: string, type: 'customer' | 'agent') {
    if (type === 'agent') {
      throw new Error('Agentes devem ser criados pela equipa operacional com nome e codigo.')
    }
    const data = await this.registerClient(name, phone)
    return data.user ? { ...data.user, token: data.token, role: 'customer', type: 'customer' } : data
  },

  async login(identifier: string, secret: string, type: 'customer' | 'agent' | 'admin') {
    if (type === 'admin') {
      return this.loginAdmin(identifier, secret)
    }
    if (type === 'agent') {
      return this.loginAgent(identifier, secret)
    }
    return this.loginClient(identifier, secret)
  },

  async logout() {
    localStorage.removeItem('smartinfo_user')
    return { success: true }
  },
}

// Calculator Service
export const calculatorService = {
  calculateSavings(distance: number, successRate: number = 0.6) {
    const transportCost = Math.min(15, Math.max(5, distance * 0.5))
    const failedAttempts = Math.ceil((1 - successRate) * 5)
    const timeWasted = failedAttempts * 30

    const beforeTrips = 5
    const beforeCost = beforeTrips * transportCost
    const beforeTime = (beforeTrips * (1 - 0.6)) * 30

    const afterTrips = 1.5
    const afterCost = afterTrips * transportCost
    const afterTime = (afterTrips * (1 - 0.95)) * 30

    return {
      beforeCost,
      afterCost,
      monthlySavings: (beforeCost - afterCost) * 15,
      timeSavedPerMonth: (beforeTime - afterTime) * 15,
      successRateImprovement: 0.95 - 0.6,
    }
  },
}
