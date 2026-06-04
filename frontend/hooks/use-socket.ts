'use client'

import { useEffect, useState } from 'react'
import { getSocket } from '@/lib/socket'

export type SocketState = 'offline' | 'online' | 'reconnecting'

export function useSocket() {
  const [state, setState] = useState<SocketState>('offline')
  const socket = getSocket()

  useEffect(() => {
    const handleConnect = () => setState('online')
    const handleDisconnect = () => setState('offline')
    const handleReconnectAttempt = () => setState('reconnecting')

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.io.on('reconnect_attempt', handleReconnectAttempt)

    if (!socket.connected) socket.connect()
    else setState('online')

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.io.off('reconnect_attempt', handleReconnectAttempt)
    }
  }, [socket])

  return { socket, state, isConnected: state === 'online' }
}
