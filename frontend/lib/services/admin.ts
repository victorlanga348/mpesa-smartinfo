import { AdminMetrics, Request } from '../types'
import { MOCK_AGENTS, CRITICAL_ZONES } from '../mock-data'

export const adminService = {
  // Get admin metrics
  async getMetrics(): Promise<AdminMetrics> {
    // Simulate fetching from backend
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Calculate metrics from stored data
    const allRequests: Request[] = []
    const storedRequests = localStorage.getItem('smartinfo_requests')
    if (storedRequests) {
      try {
        allRequests.push(...JSON.parse(storedRequests))
      } catch (e) {
        console.error('Failed to parse requests', e)
      }
    }

    const successfulRequests = allRequests.filter((r) => r.status === 'completed').length
    const failedRequests = allRequests.filter((r) => r.status === 'cancelled').length

    const avgResponseTime = MOCK_AGENTS.reduce((sum, agent) => sum + agent.responseTime, 0) / MOCK_AGENTS.length

    const requestsByType: Record<string, number> = {
      withdrawal: allRequests.filter((r) => r.type === 'withdrawal').length,
      deposit: allRequests.filter((r) => r.type === 'deposit').length,
      payment: allRequests.filter((r) => r.type === 'payment').length,
      info: allRequests.filter((r) => r.type === 'info').length,
    }

    return {
      totalUsers: this.getTotalUsers(),
      totalAgents: MOCK_AGENTS.length,
      successfulRequests,
      failedRequests,
      avgResponseTime: Math.round(avgResponseTime),
      activeZones: CRITICAL_ZONES,
      requestsByType,
    }
  },

  // Get heatmap data for critical zones
  async getHeatmapData(): Promise<Array<{ lat: number; lng: number; intensity: number }>> {
    await new Promise((resolve) => setTimeout(resolve, 200))

    return CRITICAL_ZONES.map((zone) => ({
      lat: zone.latitude,
      lng: zone.longitude,
      intensity: zone.agentsDensity,
    }))
  },

  // Get agent performance report
  async getAgentPerformance(): Promise<any[]> {
    await new Promise((resolve) => setTimeout(resolve, 200))

    return MOCK_AGENTS.map((agent) => ({
      id: agent.id,
      name: agent.name,
      rating: agent.rating,
      totalRequests: agent.totalRequests,
      avgResponseTime: agent.responseTime,
      status: agent.status,
      balance: agent.balance,
    }))
  },

  // Calculate savings for user (avg transportation cost)
  async calculateSavings(transactionCount: number): Promise<{ saved: number; avoided: number }> {
    await new Promise((resolve) => setTimeout(resolve, 100))

    const avgChapaFare = 3 // MZN per trip (conservative estimate)
    const distanceAvoidedPerTrip = 2 // km average
    const transportCostPerKm = 1.5 // MZN per km

    const saved = transactionCount * avgChapaFare
    const avoided = transactionCount * distanceAvoidedPerTrip * transportCostPerKm

    return { saved: Math.round(saved), avoided: Math.round(avoided) }
  },

  // Get total users (from localStorage)
  getTotalUsers(): number {
    const stored = localStorage.getItem('smartinfo_users')
    if (stored) {
      try {
        return JSON.parse(stored).length
      } catch (e) {
        return 0
      }
    }
    return 0
  },
}
