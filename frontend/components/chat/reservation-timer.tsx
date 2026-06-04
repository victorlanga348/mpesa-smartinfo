'use client'

import { useState, useEffect } from 'react'
import { Reservation } from '@/lib/types'
import { Clock, CheckCircle, XCircle } from 'lucide-react'

interface ReservationTimerProps {
  reservation: Reservation
  onExpired?: () => void
}

export function ReservationTimer({ reservation, onExpired }: ReservationTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime()
      const expiryTime = new Date(reservation.expiresAt).getTime()
      const diff = Math.max(0, expiryTime - now)

      if (diff === 0) {
        setExpired(true)
        onExpired?.()
      } else {
        setTimeLeft(diff)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [reservation, onExpired])

  const minutes = Math.floor(timeLeft / 60000)
  const seconds = Math.floor((timeLeft % 60000) / 1000)

  if (reservation.status === 'completed') {
    return (
      <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <span className="text-sm font-medium text-green-800">Transação completada</span>
      </div>
    )
  }

  if (reservation.status === 'expired' || expired) {
    return (
      <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
        <XCircle className="w-5 h-5 text-red-600" />
        <span className="text-sm font-medium text-red-800">Reserva expirada</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border ${
      minutes <= 2
        ? 'bg-red-50 border-red-200'
        : minutes <= 5
          ? 'bg-yellow-50 border-yellow-200'
          : 'bg-blue-50 border-blue-200'
    }`}>
      <Clock className={`w-5 h-5 ${
        minutes <= 2
          ? 'text-red-600'
          : minutes <= 5
            ? 'text-yellow-600'
            : 'text-blue-600'
      }`} />
      <div>
        <p className={`text-sm font-semibold ${
          minutes <= 2
            ? 'text-red-900'
            : minutes <= 5
              ? 'text-yellow-900'
              : 'text-blue-900'
        }`}>
          Referência: {reservation.pickupReference}
        </p>
        <p className={`text-sm ${
          minutes <= 2
            ? 'text-red-700'
            : minutes <= 5
              ? 'text-yellow-700'
              : 'text-blue-700'
        }`}>
          Tempo restante: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </p>
      </div>
    </div>
  )
}
