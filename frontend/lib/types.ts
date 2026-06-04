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
}

export interface Request {
  id: string
  customerId: string
  agentId: string
  type: 'withdrawal' | 'deposit' | 'payment' | 'info'
  amount?: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
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
