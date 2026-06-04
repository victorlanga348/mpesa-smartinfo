'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { agentService } from '@/lib/services/agent'
import { Agent } from '@/lib/types'
import { MAPUTO_CENTER } from '@/lib/mock-data'

export function MapComponent({ onAgentSelect }: { onAgentSelect?: (agent: Agent) => void }) {
  const mapRef = useRef<L.Map | null>(null)
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load map
    if (!mapRef.current) {
      mapRef.current = L.map('map', {
        center: [MAPUTO_CENTER.lat, MAPUTO_CENTER.lng],
        zoom: 13,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current)
    }

    // Load agents
    const loadAgents = async () => {
      try {
        const fetchedAgents = await agentService.getAgents()
        setAgents(fetchedAgents)

        // Clear existing markers
        mapRef.current?.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            layer.remove()
          }
        })

        // Add agent markers
        fetchedAgents.forEach((agent) => {
          const isOnline = agent.status === 'online'
          const isBusy = agent.status === 'busy'

          const markerColor = isBusy ? '#F59E0B' : isOnline ? '#16A34A' : '#9CA3AF'
          const markerHtml = `
            <div style="
              background: ${markerColor};
              width: 32px;
              height: 32px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
              cursor: pointer;
              font-weight: bold;
              color: white;
              font-size: 14px;
            ">
              M
            </div>
          `

          const customIcon = L.divIcon({
            html: markerHtml,
            iconSize: [38, 38],
            iconAnchor: [19, 19],
            popupAnchor: [0, -19],
          })

          const marker = L.marker([agent.latitude, agent.longitude], {
            icon: customIcon,
          })

          marker.bindPopup(`
            <div style="width: 200px;">
              <h3 style="font-weight: bold; margin: 0 0 8px 0;">${agent.name}</h3>
              <p style="margin: 4px 0; font-size: 12px;">
                <strong>Status:</strong> ${agent.status === 'online' ? 'Online' : agent.status === 'busy' ? 'Ocupado' : 'Offline'}
              </p>
              <p style="margin: 4px 0; font-size: 12px;">
                <strong>Local:</strong> ${agent.location}
              </p>
              <p style="margin: 4px 0; font-size: 12px;">
                <strong>Avaliação:</strong> ⭐ ${agent.rating.toFixed(1)}
              </p>
              <p style="margin: 4px 0; font-size: 12px;">
                <strong>Tempo médio:</strong> ${agent.responseTime}s
              </p>
            </div>
          `)

          marker.on('click', () => {
            onAgentSelect?.(agent)
          })

          marker.addTo(mapRef.current!)
        })
      } catch (err) {
        console.error('Failed to load agents:', err)
      } finally {
        setLoading(false)
      }
    }

    loadAgents()

    return () => {
      // Don't destroy map on unmount to preserve zoom state
    }
  }, [onAgentSelect])

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100">
      <div id="map" className="w-full h-full" style={{ minHeight: '600px' }} />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <p className="font-medium">Carregando agentes...</p>
          </div>
        </div>
      )}
    </div>
  )
}
