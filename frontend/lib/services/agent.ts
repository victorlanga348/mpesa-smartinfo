import { Agent, Request, Reservation, Message } from '../types'
import { MOCK_AGENTS } from '../mock-data'
import { v4 as uuidv4 } from 'uuid'

const AGENTS_STORAGE_KEY = 'smartinfo_agents'
const REQUESTS_STORAGE_KEY = 'smartinfo_requests'
const RESERVATIONS_STORAGE_KEY = 'smartinfo_reservations'
const MESSAGES_STORAGE_KEY = 'smartinfo_messages'

let agents = [...MOCK_AGENTS]
const requests: Map<string, Request> = new Map()
const reservations: Map<string, Reservation> = new Map()
const messages: Map<string, Message[]> = new Map()

export const agentService = {
  // Get all agents
  async getAgents(): Promise<Agent[]> {
    await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate network delay
    return agents
  },

  // Get agent by ID
  async getAgent(id: string): Promise<Agent | null> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return agents.find((a) => a.id === id) || null
  },

  // Get nearby agents (within radius in km)
  async getNearbyAgents(lat: number, lng: number, radiusKm: number = 2): Promise<Agent[]> {
    await new Promise((resolve) => setTimeout(resolve, 200))

    return agents.filter((agent) => {
      const distance = calculateDistance(lat, lng, agent.latitude, agent.longitude)
      return distance <= radiusKm && agent.status !== 'offline'
    })
  },

  // Update agent status
  async updateAgentStatus(agentId: string, status: 'online' | 'offline' | 'busy'): Promise<Agent | null> {
    const agent = agents.find((a) => a.id === agentId)
    if (agent) {
      agent.status = status
      localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(agents))
    }
    return agent || null
  },

  // Update agent balance
  async updateAgentBalance(agentId: string, amount: number): Promise<Agent | null> {
    const agent = agents.find((a) => a.id === agentId)
    if (agent) {
      agent.balance = (agent.balance || 0) + amount
      localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(agents))
    }
    return agent || null
  },

  // Create a service request
  async createRequest(customerId: string, agentId: string, type: 'withdrawal' | 'deposit' | 'payment' | 'info', amount?: number): Promise<Request> {
    const request: Request = {
      id: uuidv4(),
      customerId,
      agentId,
      type,
      amount,
      status: 'pending',
      createdAt: new Date(),
    }
    requests.set(request.id, request)
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(Array.from(requests.values())))
    return request
  },

  // Confirm request
  async confirmRequest(requestId: string): Promise<Request | null> {
    const request = requests.get(requestId)
    if (request) {
      request.status = 'confirmed'
      request.confirmedAt = new Date()
      localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(Array.from(requests.values())))
    }
    return request || null
  },

  // Complete request
  async completeRequest(requestId: string): Promise<Request | null> {
    const request = requests.get(requestId)
    if (request) {
      request.status = 'completed'
      request.completedAt = new Date()
      localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(Array.from(requests.values())))
    }
    return request || null
  },

  // Create reservation
  async createReservation(requestId: string, agentId: string, customerId: string, eta: number): Promise<Reservation> {
    const reference = `REF-${Date.now().toString().slice(-8)}`
    const reservation: Reservation = {
      id: uuidv4(),
      requestId,
      agentId,
      customerId,
      eta,
      pickupReference: reference,
      status: 'active',
      expiresAt: new Date(Date.now() + eta * 60 * 1000),
      createdAt: new Date(),
    }
    reservations.set(reservation.id, reservation)
    localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(Array.from(reservations.values())))
    return reservation
  },

  // Get active reservations
  async getActiveReservations(customerId?: string): Promise<Reservation[]> {
    const now = new Date()
    return Array.from(reservations.values()).filter(
      (r) => r.status === 'active' && r.expiresAt > now && (!customerId || r.customerId === customerId),
    )
  },

  // Send message
  async sendMessage(senderId: string, receiverId: string, text: string): Promise<Message> {
    const conversationKey = [senderId, receiverId].sort().join('-')
    const message: Message = {
      id: uuidv4(),
      senderId,
      receiverId,
      text,
      timestamp: new Date(),
      read: false,
    }

    if (!messages.has(conversationKey)) {
      messages.set(conversationKey, [])
    }
    messages.get(conversationKey)!.push(message)
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(Object.fromEntries(messages)))
    return message
  },

  // Get conversation
  async getConversation(userId1: string, userId2: string): Promise<Message[]> {
    const conversationKey = [userId1, userId2].sort().join('-')
    return messages.get(conversationKey) || []
  },

  // Initialize from storage
  initializeFromStorage(): void {
    const storedAgents = localStorage.getItem(AGENTS_STORAGE_KEY)
    if (storedAgents) {
      try {
        agents = JSON.parse(storedAgents)
      } catch (e) {
        console.error('Failed to load agents from storage', e)
      }
    }

    const storedRequests = localStorage.getItem(REQUESTS_STORAGE_KEY)
    if (storedRequests) {
      try {
        const parsed = JSON.parse(storedRequests)
        parsed.forEach((r: Request) => requests.set(r.id, r))
      } catch (e) {
        console.error('Failed to load requests from storage', e)
      }
    }

    const storedReservations = localStorage.getItem(RESERVATIONS_STORAGE_KEY)
    if (storedReservations) {
      try {
        const parsed = JSON.parse(storedReservations)
        parsed.forEach((r: Reservation) => reservations.set(r.id, r))
      } catch (e) {
        console.error('Failed to load reservations from storage', e)
      }
    }

    const storedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY)
    if (storedMessages) {
      try {
        const parsed = JSON.parse(storedMessages)
        Object.entries(parsed).forEach(([key, value]) => {
          messages.set(key, value as Message[])
        })
      } catch (e) {
        console.error('Failed to load messages from storage', e)
      }
    }
  },
}

// Helper function to calculate distance between two coordinates (Haversine)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Initialize on module load (client-side only)
if (typeof window !== 'undefined') {
  agentService.initializeFromStorage()
}
