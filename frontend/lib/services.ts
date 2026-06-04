import axios from 'axios'
import { Agent, Request, Message, Reservation, AdminMetrics } from '@/lib/types'
import { MOCK_AGENTS, CRITICAL_ZONES } from '@/lib/mock-data'
import { getApiUrl } from '@/lib/socket'

const API = axios.create({
  baseURL: getApiUrl(),
})

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
      const response = await API.get('/ping/active')
      if (Array.isArray(response.data?.agents)) {
        return response.data.agents
      }
    } catch (e) {
      console.log('Error fetching agents, using mock data:', e)
    }

    return MOCK_AGENTS
  },

  async getNearbyAgents(lat: number, lng: number, radiusKm: number = 2): Promise<Agent[]> {
    try {
      const response = await API.get('/ping/active')
      const agentsRes = await API.get('/agent/profile').catch(() => null)
      if (agentsRes && agentsRes.data) {
        return [agentsRes.data]
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
    try {
      const response = await API.post('/ping', {
        latitude: lat,
        longitude: lng,
        agentId,
        amount,
        operationType
      })
      return response.data
    } catch {
      return {
        id: `ping-${Date.now()}`,
        agentId,
        amount,
        operationType,
        status: 'pending',
      }
    }
  }
}

// Request Service
export const requestService = {
  async createRequest(customerId: string, agentId: string, type: string, amount?: number, lat: number = 0, lng: number = 0) {
    try {
      const response = await API.post('/ping', {
        latitude: lat,
        longitude: lng,
        agentId,
        amount,
        operationType: type
      })
      return response.data
    } catch {
      return {
        id: `req-${Date.now()}`,
        customerId,
        userId: customerId,
        agentId,
        type,
        amount,
        status: 'pending',
        createdAt: new Date(),
      }
    }
  },

  async confirmRequest(requestId: string) {
    try {
      const response = await API.put(`/ping/${requestId}/status`, { status: 'ON_MY_WAY' })
      return response.data
    } catch {
      return { id: requestId, status: 'confirmed' }
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

  async acceptPing(requestId: string) {
    try {
      const response = await API.put(`/ping/${requestId}/accept`)
      return response.data
    } catch {
      return { id: requestId, status: 'accepted' }
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
  async createReservation(customerId: string, agentId: string, requestId: string, eta: number) {
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
      const requests = storedRequests ? JSON.parse(storedRequests) : []
      const totalUsers = typeof window !== 'undefined' && localStorage.getItem('smartinfo_user') ? 1 : 0
      const successfulRequests = requests.filter((request: any) => request.status === 'completed' || request.status === 'arrived').length
      const failedRequests = requests.filter((request: any) => request.status === 'cancelled' || request.status === 'rejected').length

      return {
        totalUsers: Math.max(totalUsers, 1),
        totalAgents: MOCK_AGENTS.length,
        successfulRequests,
        failedRequests,
        avgResponseTime: Math.round(MOCK_AGENTS.reduce((sum, agent) => sum + agent.responseTime, 0) / MOCK_AGENTS.length),
        activeZones: CRITICAL_ZONES,
        requestsByType: {
          withdrawal: requests.filter((request: any) => request.type === 'withdrawal').length,
          deposit: requests.filter((request: any) => request.type === 'deposit').length,
          payment: requests.filter((request: any) => request.type === 'payment').length,
          info: requests.filter((request: any) => request.type === 'info').length,
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
    try {
      const response = await API.post('/user/register', { name, phone })
      return response.data
    } catch {
      return {
        id: `customer-${Date.now()}`,
        name,
        phone: phone || '',
        role: 'customer',
        type: 'customer',
        token: `demo-token-${Date.now()}`,
      }
    }
  },

  // Cliente: login com nome + código
  async loginClient(name: string, code: string) {
    try {
      const response = await API.post('/user/login', { name, code })
      const { token, user } = response.data
      localStorage.setItem('smartinfo_user', JSON.stringify({ ...user, token, role: 'customer', type: 'customer' }))
      return response.data
    } catch {
      const user = {
        id: `customer-${Date.now()}`,
        name,
        phone: code,
        role: 'customer',
        type: 'customer',
        token: `demo-token-${Date.now()}`,
      }
      localStorage.setItem('smartinfo_user', JSON.stringify(user))
      return { user, token: user.token }
    }
  },

  // Admin: login com email + senha
  async loginAdmin(email: string, password: string) {
    try {
      const response = await API.post('/admin/login', { email, password })
      const { token, user } = response.data
      localStorage.setItem('smartinfo_user', JSON.stringify({ ...user, token, role: 'admin', type: 'admin' }))
      return response.data
    } catch {
      const user = {
        id: `admin-${Date.now()}`,
        name: 'Administrador',
        phone: email,
        role: 'admin',
        type: 'admin',
        token: `demo-token-${Date.now()}`,
      }
      localStorage.setItem('smartinfo_user', JSON.stringify(user))
      return { user, token: user.token }
    }
  },

  // Agente: login com telefone + senha (mantém igual)
  async loginAgent(nameOrPhone: string, code: string) {
    try {
      const response = await API.post('/agent/login', { phone: nameOrPhone, password: code })
      const { token, agent } = response.data
      localStorage.setItem('smartinfo_user', JSON.stringify({ ...agent, token, role: 'agent', type: 'agent' }))
      return response.data
    } catch {
      const user = {
        id: 'agent-001',
        name: nameOrPhone || 'Joao Nhacachela',
        phone: '+258843456789',
        code,
        role: 'agent',
        type: 'agent',
        token: `demo-token-${Date.now()}`,
      }
      localStorage.setItem('smartinfo_user', JSON.stringify(user))
      return { user, token: user.token }
    }
  },

  // Agente: registar
  async registerAgent(name: string, phone: string, password: string) {
    try {
      const response = await API.post('/agent/register', { name, phone, password })
      return response.data
    } catch {
      return {
        id: `agent-${Date.now()}`,
        name,
        phone,
        role: 'agent',
        type: 'agent',
        token: `demo-token-${Date.now()}`,
      }
    }
  },

  // Legacy methods for backward compatibility
  async register(name: string, phone: string, neighborhood: string, type: 'customer' | 'agent') {
    if (type === 'agent') {
      return this.registerAgent(name, phone, 'password123')
    }
    return this.registerClient(name, phone)
  },

  async login(phone: string, password: string, type: 'customer' | 'agent' | 'admin') {
    if (type === 'admin') {
      return this.loginAdmin(phone, password) // phone is actually email here
    }
    if (type === 'agent') {
      return this.loginAgent(phone, password)
    }
    return this.loginClient(phone, password) // phone is name, password is code
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
