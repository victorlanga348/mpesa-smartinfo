'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Agent } from '@/lib/types'
import { MAPUTO_CENTER } from '@/lib/mock-data'
import { useGeolocation } from '@/hooks/use-geolocation'
import { useLiveAgents } from '@/hooks/use-live-agents'

export function MapComponent({ onAgentSelect }: { onAgentSelect?: (agent: Agent) => void }) {
  const mapRef = useRef<L.Map | null>(null)
  const agentMarkersRef = useRef<Map<string, L.Marker>>(new Map())
  const clientMarkerRef = useRef<L.Marker | null>(null)
  const [manualSearch, setManualSearch] = useState('')
  const { coords, error, permissionDenied } = useGeolocation({ watch: true })
  const { agents, loading, socketState } = useLiveAgents(coords)

  useEffect(() => {
    if (mapRef.current) return

    mapRef.current = L.map('map', {
      center: [MAPUTO_CENTER.lat, MAPUTO_CENTER.lng],
      zoom: 13,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapRef.current)
  }, [])

  useEffect(() => {
    if (!mapRef.current || !coords) return

    localStorage.setItem('smartinfo_client_location', JSON.stringify(coords))

    const position: L.LatLngExpression = [coords.latitude, coords.longitude]
    const clientIcon = L.divIcon({
      html: `
        <div style="
          background:#2563EB;
          width:34px;
          height:34px;
          border-radius:999px;
          border:4px solid white;
          box-shadow:0 4px 14px rgba(37,99,235,.35);
        "></div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19],
    })

    if (!clientMarkerRef.current) {
      clientMarkerRef.current = L.marker(position, { icon: clientIcon })
        .bindPopup('<strong>Voce esta aqui</strong>')
        .addTo(mapRef.current)
      mapRef.current.setView(position, 15)
    } else {
      clientMarkerRef.current.setLatLng(position)
    }
  }, [coords])

  useEffect(() => {
    if (!mapRef.current) return

    const activeIds = new Set(agents.map((agent) => agent.id))
    agentMarkersRef.current.forEach((marker, agentId) => {
      if (!activeIds.has(agentId)) {
        marker.remove()
        agentMarkersRef.current.delete(agentId)
      }
    })

    agents.forEach((agent) => {
      const marker = agentMarkersRef.current.get(agent.id)
      const position: L.LatLngExpression = [agent.latitude, agent.longitude]
      const icon = createAgentIcon(agent)

      if (marker) {
        marker.setLatLng(position)
        marker.setIcon(icon)
        marker.setPopupContent(createPopupHtml(agent))
        return
      }

      const nextMarker = L.marker(position, { icon })
      nextMarker.bindPopup(createPopupHtml(agent))
      nextMarker.on('click', () => onAgentSelect?.(agent))
      nextMarker.addTo(mapRef.current!)
      agentMarkersRef.current.set(agent.id, nextMarker)
    })
  }, [agents, onAgentSelect])

  const visibleAgents = agents.slice(0, 4)

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg bg-gray-100">
      <div id="map" className="h-full w-full" style={{ minHeight: '600px' }} />

      <div className="absolute left-3 right-3 top-3 z-[700] rounded-lg border border-gray-200 bg-white/95 p-3 shadow-lg backdrop-blur sm:left-4 sm:right-auto sm:w-80">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-gray-900">Agentes em tempo real</p>
            <p className="text-xs text-gray-600">
              Socket: {socketState === 'online' ? 'online' : socketState === 'reconnecting' ? 'reconectando' : 'offline'}
            </p>
          </div>
          <span className={`size-3 rounded-full ${socketState === 'online' ? 'bg-green-500' : socketState === 'reconnecting' ? 'bg-yellow-500' : 'bg-gray-400'}`} />
        </div>

        {(permissionDenied || error) && (
          <div className="mt-3 rounded-md border border-yellow-200 bg-yellow-50 p-3">
            <p className="text-xs leading-5 text-yellow-900">
              {error || 'Nao conseguimos aceder a sua localizacao. Pesquise o seu bairro manualmente.'}
            </p>
            <input
              value={manualSearch}
              onChange={(event) => setManualSearch(event.target.value)}
              placeholder="Pesquisar bairro manualmente..."
              className="mt-2 h-9 w-full rounded-md border border-yellow-200 bg-white px-3 text-sm outline-none focus:border-[#E60000]"
            />
          </div>
        )}

        <div className="mt-3 max-h-44 space-y-2 overflow-y-auto">
          {visibleAgents.map((agent) => (
            <button
              key={agent.id}
              type="button"
              onClick={() => onAgentSelect?.(agent)}
              className="flex w-full items-center justify-between rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-left hover:border-red-200 hover:bg-red-50"
            >
              <span>
                <span className="block text-xs font-bold text-gray-900">{agent.name}</span>
                <span className="block text-xs text-gray-600">
                  {agent.distanceKm !== undefined ? `Agente a ${agent.distanceKm.toFixed(1)} km de si` : agent.location}
                </span>
              </span>
              <span className={`size-2.5 rounded-full ${agent.status === 'online' ? 'bg-green-500' : agent.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'}`} />
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 z-[800] flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="rounded-lg bg-white p-4 shadow-lg">
            <p className="font-medium">Carregando agentes...</p>
          </div>
        </div>
      )}
    </div>
  )
}

function createAgentIcon(agent: Agent) {
  const markerColor = agent.status === 'busy' ? '#F59E0B' : agent.status === 'online' ? '#16A34A' : '#9CA3AF'
  const opacity = agent.status === 'offline' ? 0.68 : 1

  return L.divIcon({
    html: `
      <div style="
        background:${markerColor};
        width:32px;
        height:32px;
        border-radius:50%;
        display:flex;
        align-items:center;
        justify-content:center;
        border:3px solid white;
        box-shadow:0 2px 8px rgba(0,0,0,0.2);
        cursor:pointer;
        font-weight:700;
        color:white;
        font-size:14px;
        opacity:${opacity};
      ">M</div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -19],
  })
}

function createPopupHtml(agent: Agent) {
  const label = agent.status === 'online' ? 'Online' : agent.status === 'busy' ? 'Ocupado' : 'Offline'
  const distance = agent.distanceKm !== undefined
    ? `<p style="margin:4px 0;font-size:12px;"><strong>Distancia:</strong> ${agent.distanceKm.toFixed(1)} km de si</p>`
    : ''

  return `
    <div style="width:210px;">
      <h3 style="font-weight:bold;margin:0 0 8px 0;">${agent.name}</h3>
      <p style="margin:4px 0;font-size:12px;"><strong>Status:</strong> ${label}</p>
      <p style="margin:4px 0;font-size:12px;"><strong>Local:</strong> ${agent.location}</p>
      ${distance}
      <p style="margin:4px 0;font-size:12px;"><strong>Avaliacao:</strong> ${agent.rating.toFixed(1)}</p>
    </div>
  `
}
