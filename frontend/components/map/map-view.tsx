'use client'

import { useEffect, useMemo, useState } from 'react'
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { motion } from 'framer-motion'
import { LocateFixed, MapPin, Search, Sparkles, X } from 'lucide-react'
import { Agent, AgentRating, CriticalZone } from '@/lib/types'
import { agentService } from '@/lib/services'
import { CRITICAL_ZONES, MAPUTO_CENTER } from '@/lib/mock-data'

const createMarkerIcon = (status: string) => {
  const color = status === 'online' ? '#16A34A' : status === 'busy' ? '#F59E0B' : '#9CA3AF'

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 38px;
        height: 38px;
        border-radius: 999px;
        background: ${color};
        color: white;
        border: 3px solid white;
        box-shadow: 0 10px 22px rgba(0,0,0,.28);
        display: grid;
        place-items: center;
        font-weight: 800;
        animation: marker-bounce 1.4s infinite ease-in-out;
      ">M</div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -19],
  })
}

const userIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div style="
      width: 24px;
      height: 24px;
      border-radius: 999px;
      background: #2563EB;
      border: 4px solid white;
      box-shadow: 0 0 0 10px rgba(37,99,235,.18), 0 8px 20px rgba(0,0,0,.28);
    "></div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

function MapCamera({
  center,
  zoom,
}: {
  center: [number, number]
  zoom: number
}) {
  const map = useMap()

  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.1 })
  }, [center, map, zoom])

  return null
}

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const radius = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)

  return radius * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

function findZone(query: string): CriticalZone | null {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return null

  return CRITICAL_ZONES.find((zone) => zone.name.toLowerCase().includes(normalized)) || null
}

function getAgentRating(agent: Agent) {
  if (typeof window === 'undefined') {
    return { rating: agent.rating, count: 0, badge: agent.rating >= 4.8 ? 'Agente destaque' : '' }
  }

  const stored = localStorage.getItem('smartinfo_agent_ratings')
  const ratings = stored ? JSON.parse(stored) as AgentRating[] : []
  const agentRatings = ratings.filter((item) => item.agentId === agent.id)
  if (agentRatings.length === 0) {
    return { rating: agent.rating, count: 0, badge: agent.rating >= 4.8 ? 'Agente destaque' : '' }
  }

  const average = agentRatings.reduce((sum, item) => sum + Number(item.rating || 0), 0) / agentRatings.length
  const badge = average >= 4.8 ? 'Agente de excelencia' : average >= 4.5 ? 'Muito bem avaliado' : ''
  return { rating: average, count: agentRatings.length, badge }
}

export function MapView({ onAgentSelect }: { onAgentSelect: (agent: Agent) => void }) {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [zoneQuery, setZoneQuery] = useState('')
  const [selectedZone, setSelectedZone] = useState<CriticalZone | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [locationStatus, setLocationStatus] = useState<'idle' | 'asking' | 'ready' | 'failed' | 'blocked'>('idle')
  const [camera, setCamera] = useState<[number, number]>([MAPUTO_CENTER.lat, MAPUTO_CENTER.lng])
  const [zoom, setZoom] = useState(15)

  useEffect(() => {
    async function loadAgents() {
      try {
        const data = await agentService.getAllAgents()
        setAgents(data)
      } finally {
        setLoading(false)
      }
    }

    loadAgents()
  }, [])

  const requestLocation = () => {
    if (typeof window !== 'undefined' && !window.isSecureContext && window.location.hostname !== 'localhost') {
      setLocationStatus('blocked')
      return
    }

    if (!navigator.geolocation) {
      setLocationStatus('failed')
      return
    }

    setLocationStatus('asking')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next: [number, number] = [position.coords.latitude, position.coords.longitude]
        setUserLocation(next)
        setCamera(next)
        setZoom(16)
        setLocationStatus('ready')
      },
      () => setLocationStatus('failed'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }

  useEffect(() => {
    requestLocation()
  }, [])

  const availableAgents = useMemo(() => agents.filter((agent) => agent.status !== 'offline'), [agents])

  const visibleAgents = useMemo(() => {
    if (selectedZone) {
      const radiusKm = selectedZone.radius / 1000
      return availableAgents.filter((agent) =>
        distanceKm(selectedZone.latitude, selectedZone.longitude, agent.latitude, agent.longitude) <= radiusKm
      )
    }

    const query = zoneQuery.trim().toLowerCase()
    if (!query) return availableAgents

    return availableAgents.filter((agent) =>
      agent.location.toLowerCase().includes(query) ||
      agent.name.toLowerCase().includes(query)
    )
  }, [availableAgents, selectedZone, zoneQuery])

  const handleZoneSearch = (event: React.FormEvent) => {
    event.preventDefault()
    const zone = findZone(zoneQuery)
    setSelectedZone(zone)

    if (zone) {
      setCamera([zone.latitude, zone.longitude])
      setZoom(15)
    }
  }

  const clearZone = () => {
    setZoneQuery('')
    setSelectedZone(null)
    if (userLocation) {
      setCamera(userLocation)
      setZoom(16)
    } else {
      setCamera([MAPUTO_CENTER.lat, MAPUTO_CENTER.lng])
      setZoom(15)
    }
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        className="pointer-events-auto absolute left-3 right-3 top-3 z-[900] mx-auto max-w-md rounded-lg border border-white/70 bg-white/95 p-3 shadow-xl backdrop-blur"
      >
        <form onSubmit={handleZoneSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={zoneQuery}
              onChange={(event) => {
                setZoneQuery(event.target.value)
                if (!event.target.value.trim()) setSelectedZone(null)
              }}
              placeholder="Coloque uma zona: Xipamanine, Centro..."
              className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm font-medium text-gray-900 outline-none ring-red-500 transition focus:border-red-500 focus:ring-2"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700"
          >
            <Sparkles className="h-4 w-4" />
            Ver
          </button>
        </form>

        <div className="mt-3 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-gray-700">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            <span>
              {visibleAgents.length} agente{visibleAgents.length === 1 ? '' : 's'} disponivel{visibleAgents.length === 1 ? '' : 'eis'}
              {selectedZone ? ` em ${selectedZone.name}` : ''}
            </span>
          </div>
          {(selectedZone || zoneQuery) && (
            <button onClick={clearZone} className="inline-flex items-center gap-1 font-semibold text-red-600">
              <X className="h-3.5 w-3.5" />
              Limpar
            </button>
          )}
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileTap={{ scale: 0.94 }}
        onClick={requestLocation}
        className="absolute bottom-5 right-4 z-[900] inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/25 transition hover:bg-blue-700"
        title="Usar minha localizacao"
      >
        <LocateFixed className="h-5 w-5" />
      </motion.button>

      {locationStatus === 'failed' && (
        <div className="absolute bottom-5 left-4 z-[900] max-w-[260px] rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs font-medium text-yellow-900 shadow-lg">
          Nao consegui acessar a sua localizacao. Pode permitir no navegador ou pesquisar por zona.
        </div>
      )}

      {locationStatus === 'blocked' && (
        <div className="absolute bottom-5 left-4 z-[900] max-w-[280px] rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs font-medium text-yellow-900 shadow-lg">
          O navegador bloqueou a localizacao porque esta pagina esta em HTTP. Pesquise por zona ou use HTTPS para pedir GPS no celular.
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 z-[950] flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="rounded-lg bg-white p-5 text-center shadow-xl">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-red-600" />
            <p className="mt-3 font-medium text-gray-700">Carregando agentes...</p>
          </div>
        </div>
      )}

      <MapContainer
        center={[MAPUTO_CENTER.lat, MAPUTO_CENTER.lng]}
        zoom={15}
        className="h-full w-full"
        scrollWheelZoom
      >
        <MapCamera center={camera} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {selectedZone && (
          <Circle
            center={[selectedZone.latitude, selectedZone.longitude]}
            radius={selectedZone.radius}
            pathOptions={{ color: '#E60000', fillColor: '#E60000', fillOpacity: 0.12, weight: 2 }}
          />
        )}

        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              <div className="text-sm font-semibold text-blue-700">Voce esta aqui</div>
            </Popup>
          </Marker>
        )}

        {visibleAgents.map((agent) => {
          const ratingInfo = getAgentRating(agent)
          return (
            <Marker
              key={agent.id}
              position={[agent.latitude, agent.longitude]}
              icon={createMarkerIcon(agent.status)}
              eventHandlers={{ click: () => onAgentSelect(agent) }}
            >
              <Popup>
                <div className="min-w-[190px] text-sm">
                  <p className="font-bold text-gray-900">{agent.name}</p>
                  <p className="text-gray-600">{agent.location}</p>
                  {ratingInfo.badge && (
                    <span className="mt-2 inline-flex rounded-full bg-yellow-100 px-2 py-1 text-[11px] font-bold text-yellow-800">
                      {ratingInfo.badge}
                    </span>
                  )}
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span className={`text-xs font-semibold ${
                      agent.status === 'online' ? 'text-green-600' :
                      agent.status === 'busy' ? 'text-yellow-600' : 'text-gray-600'
                    }`}>
                      {agent.status === 'online' ? 'Online' : agent.status === 'busy' ? 'Ocupado' : 'Offline'}
                    </span>
                    <span className="rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                      {ratingInfo.rating.toFixed(1)} estrela
                    </span>
                  </div>
                  <button
                    onClick={() => onAgentSelect(agent)}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    Consultar agente
                  </button>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
