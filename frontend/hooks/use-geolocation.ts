'use client'

import { useEffect, useRef, useState } from 'react'

export type Coordinates = {
  latitude: number
  longitude: number
  accuracy?: number
}

type Options = {
  enabled?: boolean
  watch?: boolean
  minDistanceMeters?: number
  minIntervalMs?: number
  onLocation?: (coords: Coordinates) => void
}

export function useGeolocation({
  enabled = true,
  watch = true,
  minDistanceMeters = 20,
  minIntervalMs = 7000,
  onLocation,
}: Options = {}) {
  const [coords, setCoords] = useState<Coordinates | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const lastSentRef = useRef<{ coords: Coordinates; at: number } | null>(null)

  useEffect(() => {
    if (!enabled || typeof navigator === 'undefined' || !navigator.geolocation) {
      if (enabled) setError('Nao conseguimos aceder a sua localizacao. Pesquise o seu bairro manualmente.')
      return
    }

    const handlePosition = (position: GeolocationPosition) => {
      const nextCoords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      }

      setCoords(nextCoords)
      setError(null)
      setPermissionDenied(false)

      const now = Date.now()
      const last = lastSentRef.current
      const movedEnough = !last || haversineMeters(
        last.coords.latitude,
        last.coords.longitude,
        nextCoords.latitude,
        nextCoords.longitude,
      ) >= minDistanceMeters
      const waitedEnough = !last || now - last.at >= minIntervalMs

      if (movedEnough || waitedEnough) {
        lastSentRef.current = { coords: nextCoords, at: now }
        onLocation?.(nextCoords)
      }
    }

    const handleError = (geoError: GeolocationPositionError) => {
      if (geoError.code === geoError.PERMISSION_DENIED) setPermissionDenied(true)
      setError('Nao conseguimos aceder a sua localizacao. Pesquise o seu bairro manualmente.')
    }

    navigator.geolocation.getCurrentPosition(handlePosition, handleError, {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 8000,
    })

    if (!watch) return

    const watchId = navigator.geolocation.watchPosition(handlePosition, handleError, {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 8000,
    })

    return () => navigator.geolocation.clearWatch(watchId)
  }, [enabled, minDistanceMeters, minIntervalMs, onLocation, watch])

  return { coords, error, permissionDenied }
}

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  return haversineMeters(lat1, lng1, lat2, lng2) / 1000
}

function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
  const radius = 6371000
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)

  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
