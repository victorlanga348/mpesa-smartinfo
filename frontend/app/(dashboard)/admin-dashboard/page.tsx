'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogOut, Users, TrendingUp, MapPin, AlertCircle, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { adminService } from '@/lib/services'
import { AdminMetrics } from '@/lib/types'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const userData = localStorage.getItem('smartinfo_user')
    if (!userData) {
      router.push('/login')
    } else {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.type !== 'admin') {
        router.push('/login')
      } else {
        setUser(parsedUser)
        loadMetrics()
      }
    }
  }, [mounted, router])

  const loadMetrics = async () => {
    try {
      const data = await adminService.getDashboardMetrics()
      setMetrics(data)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('smartinfo_user')
    router.push('/login')
  }

  if (!mounted) return null

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </main>
    )
  }

  if (!user || !metrics) return null

  const totalUsers = metrics.totalUsers ?? 0
  const totalAgents = metrics.totalAgents ?? 0
  const successfulRequests = metrics.successfulRequests ?? 0
  const failedRequests = metrics.failedRequests ?? 0
  const avgResponseTime = metrics.avgResponseTime ?? 0
  const activeZones = metrics.activeZones ?? []
  const requestsByType = metrics.requestsByType ?? {}
  const totalRequests = successfulRequests + failedRequests
  const successRate = totalRequests > 0
    ? ((successfulRequests / totalRequests) * 100).toFixed(1)
    : 0

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-gray-200 p-4 sticky top-0 z-50"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
            <p className="text-sm text-gray-600">Gestão da plataforma M-Pesa SmartInfo</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </motion.header>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4 pb-20">
        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          {/* Total Users */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600 font-semibold">Total de Utilizadores</p>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalUsers.toLocaleString('pt-MZ')}</p>
            <p className="text-xs text-gray-600 mt-2">Clientes ativos</p>
          </div>

          {/* Total Agents */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600 font-semibold">Agentes Ativos</p>
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalAgents}</p>
            <p className="text-xs text-gray-600 mt-2">Online agora</p>
          </div>

          {/* Success Rate */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600 font-semibold">Taxa de Sucesso</p>
              <TrendingUp className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{successRate}%</p>
            <p className="text-xs text-gray-600 mt-2">De todas as solicitações</p>
          </div>

          {/* Avg Response Time */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600 font-semibold">Tempo Médio de Resposta</p>
              <BarChart3 className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{avgResponseTime}s</p>
            <p className="text-xs text-gray-600 mt-2">Por solicitação</p>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Requests Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Visão Geral de Solicitações</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Solicitações Concluídas</span>
                </div>
                <span className="font-bold text-gray-900">{successfulRequests.toLocaleString('pt-MZ')}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0}%`,
                  }}
                ></div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Solicitações Falhadas</span>
                </div>
                <span className="font-bold text-gray-900">{failedRequests}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{
                    width: `${totalRequests > 0 ? (failedRequests / totalRequests) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>
          </motion.div>

          {/* Request Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Tipos de Solicitação</h3>
            <div className="space-y-3">
              {Object.entries(requestsByType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-gray-700 capitalize">{type}</span>
                  <span className="font-bold text-gray-900">{count as number}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Critical Zones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            Zonas Críticas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeZones.map((zone) => (
              <div key={zone.id} className={`rounded-lg p-4 border-2 ${
                zone.priority === 'high' ? 'bg-red-50 border-red-200' :
                zone.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-gray-900">{zone.name}</h4>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    zone.priority === 'high' ? 'bg-red-200 text-red-800' :
                    zone.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-green-200 text-green-800'
                  }`}>
                    {zone.priority === 'high' ? 'Alta' : zone.priority === 'medium' ? 'Média' : 'Baixa'}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700">Raio: {zone.radius}m</p>
                  <p className="text-gray-700">Densidade de agentes: {zone.agentsDensity}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 space-y-3"
        >
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3"
            onClick={() => alert('Funcionalidade em desenvolvimento')}
          >
            Gerar Relatório Completo
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => alert('Funcionalidade em desenvolvimento')}
          >
            Configurar Zonas Críticas
          </Button>
        </motion.div>
      </div>
    </main>
  )
}
