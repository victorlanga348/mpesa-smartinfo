'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { agentService } from '@/lib/services/agent'
import { Agent } from '@/lib/types'
import { haversineKm, Coordinates } from '@/hooks/use-geolocation'
import { useSocket } from '@/hooks/use-socket'

export function useLiveAgents(clientLocation?: Coordinates | null) {
  const { socket, state } = useSocket()
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  const loadAgents = useCallback(async () => {
    try {
      const fetched = await agentService.getAgents()
      setAgents(fetched)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    socket.emit('join:map')
    loadAgents()

    const upsertAgent = (agent: Agent) => {
      setAgents((current) => {
        const exists = current.some((item) => item.id === agent.id)
        if (exists) return current.map((item) => item.id === agent.id ? { ...item, ...agent } : item)
        return [agent, ...current]
      })
    }

    const removeOrOffline = (agent: Agent) => {
      setAgents((current) => current.map((item) => item.id === agent.id ? { ...item, ...agent, status: 'offline' } : item))
    }

    socket.on('agent:online', upsertAgent)
    socket.on('agent:location-updated', upsertAgent)
    socket.on('agent:status-updated', upsertAgent)
    socket.on('agent:offline', removeOrOffline)
    socket.on('agents:list-updated', loadAgents)
    socket.on('temporary-agent:available', upsertAgent)

    return () => {
      socket.off('agent:online', upsertAgent)
      socket.off('agent:location-updated', upsertAgent)
      socket.off('agent:status-updated', upsertAgent)
      socket.off('agent:offline', removeOrOffline)
      socket.off('agents:list-updated', loadAgents)
      socket.off('temporary-agent:available', upsertAgent)
    }
  }, [loadAgents, socket])

  const sortedAgents = useMemo(() => {
    if (!clientLocation) return agents

    return [...agents]
      .map((agent) => ({
        ...agent,
        distanceKm: haversineKm(clientLocation.latitude, clientLocation.longitude, agent.latitude, agent.longitude),
      }))
      .sort((a, b) => {
        if (a.status === 'online' && b.status !== 'online') return -1
        if (a.status !== 'online' && b.status === 'online') return 1
        return (a.distanceKm ?? 999) - (b.distanceKm ?? 999)
      })
  }, [agents, clientLocation])

  return { agents: sortedAgents, loading, socketState: state, reload: loadAgents }
}
