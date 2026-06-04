'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChatBox } from '@/components/chat/chat-box'
import { ReservationTimer } from '@/components/chat/reservation-timer'
import { agentService } from '@/lib/services/agent'
import { authService } from '@/lib/services/auth'
import { Agent, Reservation } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const agentId = params.id as string
  const user = authService.getCurrentUser()

  const [agent, setAgent] = useState<Agent | null>(null)
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [loading, setLoading] = useState(true)
  const [requestAmount, setRequestAmount] = useState('')

  useEffect(() => {
    const loadAgent = async () => {
      try {
        const fetchedAgent = await agentService.getAgent(agentId)
        setAgent(fetchedAgent)

        // Load active reservations
        if (user) {
          const reservations = await agentService.getActiveReservations(user.id)
          if (reservations.length > 0) {
            setReservation(reservations[0])
          }
        }
      } catch (err) {
        console.error('Failed to load agent:', err)
      } finally {
        setLoading(false)
      }
    }

    loadAgent()
  }, [agentId, user])

  const handlePing = async () => {
    if (!user) return

    try {
      // Create a request (ping to confirm availability)
      const request = await agentService.createRequest(user.id, agentId, 'info')

      // Create a reservation with 10 minute timer
      const res = await agentService.createReservation(request.id, agentId, user.id, 10)
      setReservation(res)
    } catch (err) {
      console.error('Failed to ping agent:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary hover:text-primary/80"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Agente não encontrado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{agent.name}</h1>
          <p className="text-gray-600">{agent.location}</p>
        </div>
      </div>

      {/* Agent Status Warning */}
      {agent.status === 'offline' && (
        <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <p className="text-sm text-yellow-800">
            Este agente está offline. Você pode enviar uma mensagem e ele responderá quando voltar online.
          </p>
        </div>
      )}

      {agent.balance === 0 && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-800">
            Este agente não possui saldo disponível no momento.
          </p>
        </div>
      )}

      {/* Reservation Timer */}
      {reservation && (
        <ReservationTimer
          reservation={reservation}
          onExpired={() => setReservation(null)}
        />
      )}

      {/* Chat */}
      <div className="h-96">
        <ChatBox
          agentId={agentId}
          agentName={agent.name}
          onPing={handlePing}
        />
      </div>

      {/* Request Form */}
      {!reservation && agent.status !== 'offline' && agent.balance !== 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Fazer Pedido</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Pedido
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="info">Informação</option>
                <option value="withdrawal">Levantamento</option>
                <option value="deposit">Depósito</option>
                <option value="payment">Pagamento</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor (MZN)
              </label>
              <input
                type="number"
                value={requestAmount}
                onChange={(e) => setRequestAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <Button
              onClick={handlePing}
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              Confirmar Disponibilidade
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
