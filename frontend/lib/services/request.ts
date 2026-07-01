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

export const requestService = {
  async createRequest(customerId: string, agentId: string, type: string, amount?: number, lat: number = 0, lng: number = 0) {
    const response = await apiRequest('/ping', {
      method: 'POST',
      body: JSON.stringify({
        latitude: lat,
        longitude: lng,
        agentId,
        amount,
        operationType: type,
      }),
    })

    return response
  },

  async confirmRequest(requestId: string) {
    try {
      return await apiRequest(`/ping/${requestId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'WAITING_LIST' }),
      })
    } catch {
      return { id: requestId, status: 'waiting_list' }
    }
  },

  async updatePingStatus(requestId: string, status: string) {
    try {
      return await apiRequest(`/ping/${requestId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      })
    } catch {
      return { id: requestId, status }
    }
  },

  async cancelPing(requestId: string) {
    return apiRequest(`/ping/${requestId}/cancel`, { method: 'PUT' })
  },

  async markArrived(requestId: string) {
    return apiRequest(`/ping/${requestId}/arrive`, { method: 'PUT' })
  },

  async rateAgent(requestId: string, rating: number, comment?: string) {
    return apiRequest(`/ping/${requestId}/rating`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    })
  },

  async acceptPing(requestId: string) {
    try {
      return await apiRequest(`/ping/${requestId}/accept`, { method: 'PUT' })
    } catch {
      return { id: requestId, status: 'waiting_list' }
    }
  },
}
