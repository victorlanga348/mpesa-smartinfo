'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { adminService } from '@/lib/services/admin'
import { AdminMetrics } from '@/lib/types'
import { Users, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('smartinfo_user')
    const user = userData ? JSON.parse(userData) : null
    if (!user || (user.role !== 'admin' && user.type !== 'admin')) {
      router.push('/login')
      return
    }

    const loadMetrics = async () => {
      try {
        const data = await adminService.getMetrics()
        setMetrics(data)
      } catch (err) {
        console.error('Failed to load metrics:', err)
      } finally {
        setLoading(false)
      }
    }

    loadMetrics()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Painel Admin</h1>
        <p className="text-red-600 mt-2">Falha ao carregar métricas</p>
      </div>
    )
  }

  const totalUsers = metrics.totalUsers ?? 0
  const totalAgents = metrics.totalAgents ?? 0
  const successfulRequests = metrics.successfulRequests ?? 0
  const failedRequests = metrics.failedRequests ?? 0
  const avgResponseTime = metrics.avgResponseTime ?? 0
  const activeZones = metrics.activeZones ?? []
  const requestsByType = metrics.requestsByType ?? {}
  const requestTypeTotal = Object.values(requestsByType).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Painel de Administração</h1>
        <p className="text-gray-600 mt-2">Visão geral do sistema SmartInfo</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Utilizadores Totais</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalUsers}</p>
            </div>
            <Users className="w-10 h-10 text-blue-500/20" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Agentes Ativos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalAgents}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-500/20" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Transações Bem-sucedidas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{successfulRequests}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500/20" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tempo Médio de Resposta</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{avgResponseTime}s</p>
            </div>
            <AlertCircle className="w-10 h-10 text-yellow-500/20" />
          </div>
        </div>
      </div>

      {/* Request Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Tipo de Solicitações</h2>
          <div className="space-y-4">
            {Object.entries(requestsByType).map(([type, count]) => (
              <div key={type}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700 capitalize">{type}</p>
                  <p className="text-sm font-semibold text-gray-900">{count}</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{
                      width: `${Math.max(
                        10,
                        requestTypeTotal > 0 ? (count / requestTypeTotal) * 100 : 0,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Zones */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Zonas Críticas</h2>
          <div className="space-y-3">
            {activeZones.map((zone) => (
              <div
                key={zone.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div>
                  <p className="font-medium text-gray-900">{zone.name}</p>
                  <p className="text-sm text-gray-600">
                    {zone.agentsDensity} agentes na zona
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    zone.priority === 'high'
                      ? 'bg-red-100 text-red-800'
                      : zone.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                  }`}
                >
                  {zone.priority === 'high' ? 'Alta' : zone.priority === 'medium' ? 'Média' : 'Baixa'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumo de Performance</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-600 text-sm">Taxa de Sucesso</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {Math.round(
                (successfulRequests /
                  (successfulRequests + failedRequests || 1)) *
                  100,
              )}
              %
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Total de Transações</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {successfulRequests + failedRequests}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Cobertura Geográfica</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{activeZones.length} zonas</p>
          </div>
        </div>
      </div>
    </div>
  )
}
