import { Reservation } from '@/lib/types'
import { getApiUrl } from '@/lib/socket'

async function apiRequest(path: string, options: RequestInit = {}) {
  const response = await fetch(`${getApiUrl()}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error((error as { error?: string }).error || `Erro na API: ${response.status}`)
  }

  return response.json()
}

export const reservationService = {
  async createReservation(customerId: string, agentId: string, requestId: string, eta: number): Promise<Reservation> {
    try {
      const response = await apiRequest(`/ping/${requestId}`)
      return {
        id: response.id,
        requestId: response.id,
        agentId: response.agentId,
        customerId: response.userId,
        eta,
        pickupReference: response.reservationToken || 'MPESA-XYZ123',
        status: 'active',
        expiresAt: response.reservationExpires ? new Date(response.reservationExpires) : new Date(Date.now() + eta * 60 * 1000),
        createdAt: new Date(),
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
        createdAt: new Date(),
      }
    }
  },
}
