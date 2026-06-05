// Core types for M-Pesa SmartInfo application

export interface User {
  id: string
  name: string
  phone: string
  role: 'customer' | 'agent' | 'admin'
  neighborhood?: string
  usageFrequency?: 'daily' | 'weekly' | 'rarely'
  createdAt: Date
}

export interface Agent {
  id: string
  name: string
  phone: string
  latitude: number
  longitude: number
  status: 'online' | 'offline' | 'busy'
  balance?: number
  location: string
  rating: number
  responseTime: number // in seconds
  totalRequests: number
  distanceKm?: number
}

export interface Request {
  id: string
  customerId: string
  customerName?: string
  customerPhone?: string
  agentId: string
  type: 'withdrawal' | 'deposit' | 'payment' | 'info'
  amount?: number
  status: 'pending' | 'accepted' | 'waiting_list' | 'arrived' | 'in_service' | 'completed' | 'rejected' | 'cancelled'
  createdAt: Date
  confirmedAt?: Date
  completedAt?: Date
}

export interface Reservation {
  id: string
  requestId: string
  agentId: string
  customerId: string
  eta: number // in minutes
  pickupReference: string
  status: 'active' | 'completed' | 'expired'
  expiresAt: Date
  createdAt: Date
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  text: string
  timestamp: Date
  read: boolean
}

export interface CriticalZone {
  id: string
  name: string
  latitude: number
  longitude: number
  radius: number // in meters
  priority: 'high' | 'medium' | 'low'
  agentsDensity: number
}

export interface AdminMetrics {
  totalUsers: number
  totalAgents: number
  successfulRequests: number
  failedRequests: number
  avgResponseTime: number
  activeZones: CriticalZone[]
  requestsByType: Record<string, number>
}

export interface StoredUser {
  id?: string
  name?: string
  phone?: string
  email?: string
  role?: 'customer' | 'agent' | 'admin' | 'user'
  type?: 'customer' | 'agent' | 'admin'
  token?: string
}

export interface ApiAgent {
  id: string
  name?: string | null
  phone?: string | null
  latitude?: number | string | null
  longitude?: number | string | null
  status?: string | null
  reference?: string | null
  updatedAt?: string
}

export interface ApiPing {
  id: string
  userId?: string
  user?: {
    id?: string
    name?: string | null
    phone?: string | null
  }
  agentId?: string
  amount?: number
  operationType?: Request['type'] | string
  status?: string
  reservationToken?: string | null
  reservationExpires?: string | null
  createdAt?: string
  error?: string
}

export interface AgentRating {
  id: string
  agentId: string
  agentName?: string
  userId?: string
  userName?: string
  rating: number
  createdAt: string
}

export interface LocalRequest extends Omit<Request, 'createdAt' | 'status'> {
  createdAt: string | Date
  customerName?: string
  customerPhone?: string
  agentName?: string
  waitMinutes?: number | null
  status: Request['status'] | 'customer_on_way' | 'arrived'
}

export interface ConversationSummary {
  id: string
  lastMessage: string
  timestamp: string | Date
  unread: boolean
}

export interface AgentPerformance {
  id: string
  name: string
  rating: number
  totalRequests: number
  avgResponseTime: number
  status: Agent['status']
  balance?: number
}

export interface ApiErrorBody {
  error?: string
}
