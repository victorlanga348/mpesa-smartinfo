'use client'

import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export function getSocketUrl() {
  if (process.env.NEXT_PUBLIC_SOCKET_URL) return process.env.NEXT_PUBLIC_SOCKET_URL
  if (process.env.VITE_SOCKET_URL) return process.env.VITE_SOCKET_URL

  if (typeof window !== 'undefined') {
    const { hostname } = window.location
    return `http://${hostname}:5000`
  }

  return 'http://localhost:5000'
}

export function getApiUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL
  if (process.env.VITE_API_URL) return process.env.VITE_API_URL

  if (typeof window !== 'undefined') {
    const { hostname } = window.location
    return `http://${hostname}:5000/api`
  }

  return 'http://localhost:5000/api'
}

export function getSocket() {
  if (!socket) {
    socket = io(getSocketUrl(), {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 600,
      reconnectionDelayMax: 5000,
      transports: ['websocket', 'polling'],
    })
  }

  return socket
}

export function authHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {}

  const stored = localStorage.getItem('smartinfo_user')
  if (!stored) return {}

  try {
    const user = JSON.parse(stored)
    return typeof user.token === 'string' ? { Authorization: `Bearer ${user.token}` } : {}
  } catch {
    return {}
  }
}
