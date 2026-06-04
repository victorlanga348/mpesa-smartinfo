'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle, MapPin, Star, Zap } from 'lucide-react'
import { Agent, Request } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { agentService, requestService, reservationService } from '@/lib/services'

export function AgentBottomSheet({
  agent,
  isOpen,
  onClose,
  onRequestCreated,
}: {
  agent: Agent | null
  isOpen: boolean
  onClose: () => void
  onRequestCreated?: (request: Request) => void
}) {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'select' | 'confirm' | 'reserved' | 'rating'>('select')
  const [waitMinutes, setWaitMinutes] = useState(10)
  const [reservation, setReservation] = useState<any>(null)
  const [operationType, setOperationType] = useState<'withdrawal' | 'deposit'>('withdrawal')
  const [amount, setAmount] = useState<number>(1000)
  const [currentRequest, setCurrentRequest] = useState<any>(null)
  const [rating, setRating] = useState(5)
  const [alreadyRated, setAlreadyRated] = useState(false)

  const getUser = () => JSON.parse(localStorage.getItem('smartinfo_user') || '{}')

  const getRatings = () => {
    const stored = localStorage.getItem('smartinfo_agent_ratings')
    return stored ? JSON.parse(stored) : []
  }

  const hasRatedAgent = (agentId: string) => {
    const user = getUser()
    return getRatings().some((item: any) => item.agentId === agentId && item.userId === user.id)
  }

  const saveRating = () => {
    if (!agent) return
    const user = getUser()
    const ratings = getRatings()
    if (ratings.some((item: any) => item.agentId === agent.id && item.userId === user.id)) {
      setAlreadyRated(true)
      return
    }

    localStorage.setItem('smartinfo_agent_ratings', JSON.stringify([
      ...ratings,
      {
        id: `rating-${Date.now()}`,
        agentId: agent.id,
        agentName: agent.name,
        userId: user.id,
        userName: user.name,
        rating,
        createdAt: new Date().toISOString(),
      },
    ]))
    setAlreadyRated(true)
  }

  const saveLocalRequest = (request: any) => {
    const stored = localStorage.getItem('smartinfo_requests')
    const requests = stored ? JSON.parse(stored) : []
    const user = JSON.parse(localStorage.getItem('smartinfo_user') || '{}')
    const nextRequest = {
      id: request.id || `req-${Date.now()}`,
      customerId: user.id || `customer-${Date.now()}`,
      customerName: user.name || 'Cliente',
      customerPhone: user.phone || '',
      agentId: agent?.id,
      agentName: agent?.name,
      type: operationType,
      amount,
      status: 'pending',
      waitMinutes: null,
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem('smartinfo_requests', JSON.stringify([nextRequest, ...requests]))
    return nextRequest
  }

  const updateLocalRequest = (id: string, changes: Record<string, any>) => {
    const stored = localStorage.getItem('smartinfo_requests')
    const requests = stored ? JSON.parse(stored) : []
    const updated = requests.map((request: any) => request.id === id ? { ...request, ...changes } : request)
    localStorage.setItem('smartinfo_requests', JSON.stringify(updated))
    return updated.find((request: any) => request.id === id)
  }

  const removeLocalRequest = (id: string) => {
    const stored = localStorage.getItem('smartinfo_requests')
    const requests = stored ? JSON.parse(stored) : []
    localStorage.setItem('smartinfo_requests', JSON.stringify(requests.filter((request: any) => request.id !== id)))
  }

  useEffect(() => {
    if (!currentRequest?.id || step !== 'reserved') return

    const timer = window.setInterval(() => {
      const stored = localStorage.getItem('smartinfo_requests')
      const requests = stored ? JSON.parse(stored) : []
      const updated = requests.find((request: any) => request.id === currentRequest.id)
      if (updated) {
        setCurrentRequest(updated)
      } else {
        setCurrentRequest((request: any) => request ? { ...request, status: 'rejected' } : request)
      }
    }, 1000)

    return () => window.clearInterval(timer)
  }, [currentRequest?.id, step])

  const handlePingAgent = async () => {
    if (!agent) return

    setLoading(true)
    try {
      const result = await agentService.pingAgent(agent.id, amount, operationType, agent.latitude, agent.longitude)
      const localRequest = saveLocalRequest(result)
      setCurrentRequest(localRequest)
      setWaitMinutes(10)
      setStep('confirm')
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao consultar o agente. Verifique se o servidor está ativo.')
    } finally {
      setLoading(false)
    }
  }

  const handleRequestLiquidity = async () => {
    if (!agent) return

    setLoading(true)
    try {
      const user = JSON.parse(localStorage.getItem('smartinfo_user') || '{}')
      const request = currentRequest || await requestService.createRequest(user.id, agent.id, operationType, amount)
      const localRequest = currentRequest || saveLocalRequest(request)
      const queuedRequest = updateLocalRequest(localRequest.id, {
        status: 'pending',
        waitMinutes,
        amount,
        type: operationType,
      }) || localRequest

      const res = await reservationService.createReservation(
        user.id,
        agent.id,
        queuedRequest.id,
        waitMinutes
      )

      setReservation(res)
      setStep('reserved')
      setCurrentRequest(queuedRequest)
      onRequestCreated?.(queuedRequest)
    } catch (error: any) {
      alert('Erro ao criar reserva.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setStep('select')
    setCurrentRequest(null)
    onClose()
  }

  const handleArrived = () => {
    if (currentRequest?.id) {
      removeLocalRequest(currentRequest.id)
    }
    setAlreadyRated(agent ? hasRatedAgent(agent.id) : false)
    setStep('rating')
  }

  const handleConfirmComing = () => {
    if (!currentRequest?.id) return
    const updated = updateLocalRequest(currentRequest.id, { status: 'customer_on_way' })
    setCurrentRequest(updated || { ...currentRequest, status: 'customer_on_way' })
  }

  if (!agent) return null

  const agentRatings = getRatings().filter((item: any) => item.agentId === agent.id)
  const agentAverageRating = agentRatings.length > 0
    ? agentRatings.reduce((sum: number, item: any) => sum + Number(item.rating || 0), 0) / agentRatings.length
    : agent.rating
  const agentBadge = agentAverageRating >= 4.8
    ? 'Agente de excelencia'
    : agentAverageRating >= 4.5
      ? 'Muito bem avaliado'
      : ''

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[1500] bg-white/70 backdrop-blur-md"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[1600] mx-auto w-full rounded-t-2xl bg-white shadow-2xl sm:max-w-md"
          >
            <div className="max-h-[84vh] overflow-y-auto p-5 sm:p-6">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {step === 'select' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  {/* Agent Info */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{agent.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <MapPin className="w-4 h-4 text-gray-600" />
                      <p className="text-gray-600">{agent.location}</p>
                    </div>
                    {agentBadge && (
                      <span className="mt-3 inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-800">
                        {agentBadge}
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <Star className="w-5 h-5 text-yellow-500 mx-auto mb-2" />
                      <p className="font-bold text-gray-900">{agentAverageRating.toFixed(1)}</p>
                      <p className="text-xs text-gray-600">Classificação</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <Zap className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                      <p className="font-bold text-gray-900">{agent.responseTime}s</p>
                      <p className="text-xs text-gray-600">Tempo médio</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="font-bold text-gray-900">{agent.totalRequests}</p>
                      <p className="text-xs text-gray-600">Transações</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status do agente:</span>
                    <span
                      className={`inline-block w-3 h-3 rounded-full ${
                        agent.status === 'online'
                          ? 'bg-green-500'
                          : agent.status === 'busy'
                          ? 'bg-yellow-500'
                          : 'bg-gray-400'
                      }`}
                    />
                    <span className="font-semibold text-gray-900">
                      {agent.status === 'online'
                        ? 'Online'
                        : agent.status === 'busy'
                        ? 'Ocupado'
                        : 'Offline'}
                    </span>
                  </div>

                  {/* Operation Type selection and Amount input */}
                  <div className="space-y-4 border-t border-gray-100 pt-4">
                    <label className="block text-sm font-semibold text-gray-700">Operação Pretendida</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setOperationType('withdrawal')}
                        className={`py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
                          operationType === 'withdrawal'
                            ? 'bg-red-50 border-red-500 text-red-600'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Levantamento
                      </button>
                      <button
                        type="button"
                        onClick={() => setOperationType('deposit')}
                        className={`py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
                          operationType === 'deposit'
                            ? 'bg-red-50 border-red-500 text-red-600'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Depósito
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Valor da Transação (MT)</label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500 text-gray-900 font-semibold"
                        placeholder="Ex: 1000"
                        min="10"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4">
                    <Button
                      onClick={handlePingAgent}
                      disabled={loading}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3"
                    >
                      {loading ? 'Verificando...' : 'Perguntar Disponibilidade'}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => { window.location.href = `/app/chat/${agent.id}` }}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Enviar mensagem
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 'confirm' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-gray-900">Confirmar {operationType === 'withdrawal' ? 'Levantamento' : 'Depósito'}</h3>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Montante:</span>
                      <span className="font-bold text-gray-900">{amount} MZN</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Agente:</span>
                      <span className="font-bold text-gray-900">{agent.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Tempo reservado:</span>
                      <span className="font-bold text-gray-900">{waitMinutes} minutos</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-700">Quanto tempo o agente deve esperar por si?</p>
                    <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="wait"
                        value="5"
                        checked={waitMinutes === 5}
                        onChange={() => setWaitMinutes(5)}
                      />
                      <span>5 minutos</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="wait"
                        value="10"
                        checked={waitMinutes === 10}
                        onChange={() => setWaitMinutes(10)}
                      />
                      <span>10 minutos</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="wait"
                        value="15"
                        checked={waitMinutes === 15}
                        onChange={() => setWaitMinutes(15)}
                      />
                      <span>15 minutos</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="wait"
                        value="20"
                        checked={waitMinutes === 20}
                        onChange={() => setWaitMinutes(20)}
                      />
                      <span>20 minutos</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="wait"
                        value="30"
                        checked={waitMinutes === 30}
                        onChange={() => setWaitMinutes(30)}
                      />
                      <span>30 minutos</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="wait"
                        value="45"
                        checked={waitMinutes === 45}
                        onChange={() => setWaitMinutes(45)}
                      />
                      <span>45 minutos</span>
                    </label>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Button
                      onClick={handleRequestLiquidity}
                      disabled={loading}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3"
                    >
                      {loading ? 'Enviando pedido...' : 'Enviar pedido ao agente'}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setStep('select')}
                      disabled={loading}
                    >
                      Voltar
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 'reserved' && reservation && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 text-center"
                >
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {currentRequest?.status === 'accepted'
                        ? 'Agente aceitou o pedido'
                        : currentRequest?.status === 'customer_on_way'
                          ? 'Voce confirmou que esta a caminho'
                          : currentRequest?.status === 'rejected'
                            ? 'Pedido recusado'
                            : 'Aguardando confirmacao do agente'}
                    </h3>
                    <p className="text-gray-600 mt-2">
                      {currentRequest?.status === 'accepted'
                        ? 'Agora confirme se vai se deslocar ate ao agente.'
                        : currentRequest?.status === 'customer_on_way'
                          ? 'Quando chegar ao agente, toque em Cheguei.'
                          : currentRequest?.status === 'rejected'
                            ? 'Escolha outro agente disponivel na zona.'
                            : 'O agente precisa aceitar antes de voce dizer que esta a vir.'}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-left">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Código de confirmação:</span>
                      <span className="font-mono font-bold text-gray-900">{reservation.pickupReference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tempo reservado:</span>
                      <span className="font-bold text-gray-900">{reservation.eta} minutos</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Agente:</span>
                      <span className="font-bold text-gray-900">{agent.name}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">
                    {currentRequest?.status === 'customer_on_way'
                      ? 'Quando chegar ao agente, toque em "Cheguei" para sair da lista de espera.'
                      : 'O pedido fica na fila do agente enquanto aguarda resposta.'}
                  </p>

                  <div className="space-y-3 pt-4">
                    {currentRequest?.status === 'accepted' && (
                      <Button
                        onClick={handleConfirmComing}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3"
                      >
                        Estou a vir
                      </Button>
                    )}
                    {currentRequest?.status === 'customer_on_way' && (
                      <Button
                        onClick={handleArrived}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3"
                      >
                        Cheguei
                      </Button>
                    )}
                    {currentRequest?.status === 'pending' && (
                      <Button disabled className="w-full bg-gray-300 text-gray-700 font-semibold py-3">
                        Aguardando agente
                      </Button>
                    )}
                    {currentRequest?.status === 'rejected' && (
                      <Button onClick={handleClose} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3">
                        Escolher outro agente
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => { window.location.href = `/app/chat/${agent.id}` }}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Conversar com agente
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 'rating' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 text-center"
                >
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Classificar agente</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Cada utilizador pode avaliar este agente apenas uma vez.
                    </p>
                  </div>

                  {alreadyRated ? (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-800">
                      A sua avaliacao para este agente ja foi registada.
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setRating(value)}
                            className="p-1"
                          >
                            <Star
                              className={`h-9 w-9 ${value <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          </button>
                        ))}
                      </div>
                      <Button
                        onClick={saveRating}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3"
                      >
                        Enviar classificacao
                      </Button>
                    </>
                  )}

                  <Button variant="outline" className="w-full" onClick={handleClose}>
                    Fechar
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
