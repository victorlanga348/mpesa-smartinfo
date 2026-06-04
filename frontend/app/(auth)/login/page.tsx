'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, Smartphone, Shield, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { authService } from '@/lib/services'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('customer')

  // Cliente: nome + numero
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')

  // Admin: email + senha
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')

  // Agente: nome + codigo
  const [agentName, setAgentName] = useState('')
  const [agentCode, setAgentCode] = useState('')

  const handleClientLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!clientName || !clientPhone) {
        throw new Error('Preencha o nome e o numero')
      }
      await authService.loginClient(clientName, clientPhone)
      router.push('/map')
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || 'Erro ao fazer login')
      setLoading(false)
    }
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!adminEmail || !adminPassword) {
        throw new Error('Preencha o email e a senha')
      }
      await authService.loginAdmin(adminEmail, adminPassword)
      router.push('/admin-dashboard')
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || 'Erro ao fazer login')
      setLoading(false)
    }
  }

  const handleAgentLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!agentName || !agentCode) {
        throw new Error('Preencha o nome e o codigo do agente')
      }
      await authService.loginAgent(agentName, agentCode)
      router.push('/agent-dashboard')
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || 'Erro ao fazer login')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 ml-3">SmartInfo</h1>
        </div>

        <div className="mb-5 flex justify-center">
          <Button asChild variant="outline" className="border-red-200 bg-white/80 text-red-700 hover:bg-red-50">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Voltar a pagina inicial
            </Link>
          </Button>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Entrar</h2>
        <p className="text-gray-600 text-center mb-8">Acesse sua conta</p>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setError('') }} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="customer" className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Cliente
            </TabsTrigger>
            <TabsTrigger value="agent" className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" />
              Agente
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Admin
            </TabsTrigger>
          </TabsList>

          {/* Cliente: nome + numero */}
          <TabsContent value="customer" className="space-y-4">
            <form onSubmit={handleClientLogin} className="space-y-4">
              {error && activeTab === 'customer' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <Input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Maria Joaquina"
                  disabled={loading}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Numero M-Pesa</label>
                <Input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="843456789"
                  disabled={loading}
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </TabsContent>

          {/* Agente: nome + codigo */}
          <TabsContent value="agent" className="space-y-4">
            <form onSubmit={handleAgentLogin} className="space-y-4">
              {error && activeTab === 'agent' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do agente
                </label>
                <Input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="Joao Nhacachela"
                  disabled={loading}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Codigo do agente</label>
                <Input
                  type="text"
                  value={agentCode}
                  onChange={(e) => setAgentCode(e.target.value)}
                  placeholder="AGENTE123"
                  disabled={loading}
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </TabsContent>

          {/* ── Admin: Email + Senha ── */}
          <TabsContent value="admin" className="space-y-4">
            <form onSubmit={handleAdminLogin} className="space-y-4">
              {error && activeTab === 'admin' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@smartinfo.co.mz"
                  disabled={loading}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <Input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {/* Demo Credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
        >
          <p className="text-sm text-blue-900 font-semibold mb-2">Credenciais de demonstração:</p>
          <div className="space-y-1.5">
            <div className="text-xs text-blue-800">
              <span className="font-medium">Cliente:</span> Nome: <code className="bg-blue-100 px-1 rounded">Maria Joaquina</code> | Numero: <code className="bg-blue-100 px-1 rounded">843456789</code>
            </div>
            <div className="text-xs text-blue-800">
              <span className="font-medium">Agente:</span> Nome: <code className="bg-blue-100 px-1 rounded">Joao Nhacachela</code> | Codigo: <code className="bg-blue-100 px-1 rounded">AGENTE123</code>
            </div>
            <div className="text-xs text-blue-800">
              <span className="font-medium">🛡️ Admin:</span> Email: <code className="bg-blue-100 px-1 rounded">admin@smartinfo.co.mz</code> | Senha: <code className="bg-blue-100 px-1 rounded">admin123</code>
            </div>
          </div>
        </motion.div>
        <p className="text-center text-sm text-gray-600">
          Clientes entram apenas com nome e numero. Se nao existir conta, ela e criada automaticamente.
        </p>
      </motion.div>
    </main>
  )
}

