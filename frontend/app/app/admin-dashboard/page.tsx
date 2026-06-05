'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle, MapPin, Radio, Users, type LucideIcon } from 'lucide-react'
import { useSocket } from '@/hooks/use-socket'
import { adminService } from '@/lib/services/admin'
import { AdminMetrics, StoredUser } from '@/lib/types'
import { parseJson } from '@/lib/runtime'

export const dynamic = 'force-dynamic'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const { socket, state: socketState } = useSocket()

  useEffect(() => {
    const userData = localStorage.getItem('smartinfo_user')
    const user = parseJson<StoredUser | null>(userData, null)
    if (!user || (user.role !== 'admin' && user.type !== 'admin')) {
      router.push('/login')
      return
    }

    const loadMetrics = async () => {
      try {
        setMetrics(await adminService.getMetrics())
      } catch (error) {
        console.error('Failed to load metrics:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMetrics()
    socket.emit('join:admin')
    socket.on('admin:metrics-updated', loadMetrics)

    return () => {
      socket.off('admin:metrics-updated', loadMetrics)
    }
  }, [router, socket])

  if (loading) return <PageMessage text="A carregar actividade operacional..." />

  if (!metrics) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Painel admin</h1>
        <p className="mt-2 text-red-600">Nao foi possivel carregar os dados operacionais.</p>
      </div>
    )
  }

  const totalUsers = metrics.totalUsers ?? 0
  const totalAgents = metrics.totalAgents ?? 0
  const successfulRequests = metrics.successfulRequests ?? 0
  const failedRequests = metrics.failedRequests ?? 0
  const activeZones = metrics.activeZones ?? []
  const requestsByType = metrics.requestsByType ?? {}
  const totalRequests = successfulRequests + failedRequests

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Painel admin</h1>
        <p className="mt-2 text-gray-600">Estado operacional do M-Pesa SmartInfo em tempo real.</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700">
        Ligacao em tempo real: <strong>{socketState === 'online' ? 'online' : socketState === 'reconnecting' ? 'reconectando' : 'offline'}</strong>
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={Users} label="Utilizadores registados" value={totalUsers.toString()} empty={totalUsers === 0} />
        <MetricCard icon={MapPin} label="Agentes registados" value={totalAgents.toString()} empty={totalAgents === 0} />
        <MetricCard icon={CheckCircle} label="Pedidos concluidos" value={successfulRequests.toString()} empty={successfulRequests === 0} />
        <MetricCard icon={Radio} label="Estado do sistema" value="Operacional" />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Pedidos por tipo</h2>
          {Object.values(requestsByType).some((count) => Number(count) > 0) ? (
            <div className="space-y-4">
              {Object.entries(requestsByType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <span className="text-sm font-medium text-gray-700">{operationLabel(type)}</span>
                  <span className="text-sm font-semibold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState text="Os dados serao apresentados quando houver actividade suficiente." />
          )}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Zonas criticas</h2>
          {activeZones.length > 0 ? (
            <div className="space-y-3">
              {activeZones.map((zone) => (
                <div key={zone.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <div>
                    <p className="font-medium text-gray-900">{zone.name}</p>
                    <p className="text-sm text-gray-600">{zone.agentsDensity} agentes na zona</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-sm font-medium ${
                    zone.priority === 'high'
                      ? 'bg-red-100 text-red-800'
                      : zone.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                  }`}>
                    {zone.priority === 'high' ? 'Alta' : zone.priority === 'medium' ? 'Media' : 'Baixa'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState text="Ainda nao existem zonas criticas registadas." />
          )}
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Resumo operacional</h2>
        {totalRequests > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryItem label="Pedidos concluidos" value={successfulRequests.toString()} />
            <SummaryItem label="Pedidos sem sucesso" value={failedRequests.toString()} />
            <SummaryItem label="Total de pedidos" value={totalRequests.toString()} />
          </div>
        ) : (
          <EmptyState text="Sem actividade registada." />
        )}
      </section>
    </div>
  )
}

function MetricCard({ icon: Icon, label, value, empty = false }: { icon: LucideIcon; label: string; value: string; empty?: boolean }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {empty && <p className="mt-2 text-xs text-gray-500">Sem dados suficientes.</p>}
        </div>
        <Icon className="size-10 text-[#E60000]/20" />
      </div>
    </div>
  )
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
      <AlertCircle className="mx-auto mb-3 size-8 text-gray-400" />
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  )
}

function PageMessage({ text }: { text: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>{text}</p>
    </div>
  )
}

function operationLabel(type: string) {
  if (type === 'withdrawal') return 'Levantamento'
  if (type === 'deposit') return 'Deposito'
  if (type === 'payment') return 'Pagamento'
  if (type === 'info') return 'Informacao'
  return type
}
