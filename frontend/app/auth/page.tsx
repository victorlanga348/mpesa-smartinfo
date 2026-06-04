'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/services/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { ArrowRight, User, Shield } from 'lucide-react'

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'client' | 'admin'>('client')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Client login: nome + código
  const [clientName, setClientName] = useState('')
  const [clientCode, setClientCode] = useState('')

  // Admin login: email + senha
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')

  const handleClientLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!clientName || !clientCode) {
        throw new Error('Preencha o nome e o código')
      }

      // Call API
      const response = await fetch('http://localhost:5000/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: clientName, code: clientCode }),
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Erro ao fazer login')

      localStorage.setItem('smartinfo_user', JSON.stringify({ ...data.user, token: data.token, type: 'customer', role: 'customer' }))
      router.push('/app/map')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login falhou')
    } finally {
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

      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Erro ao fazer login')

      localStorage.setItem('smartinfo_user', JSON.stringify({ ...data.user, token: data.token, type: 'admin', role: 'admin' }))
      router.push('/app/admin-dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login falhou')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary/90 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">SmartInfo</h1>
          <p className="text-white/80">Saiba antes de sair.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => { setActiveTab('client'); setError('') }}
              className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'client'
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-4 h-4" />
              Cliente
            </button>
            <button
              onClick={() => { setActiveTab('admin'); setError('') }}
              className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'admin'
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Shield className="w-4 h-4" />
              Admin
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {activeTab === 'client' ? (
              <form onSubmit={handleClientLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <Input
                    type="text"
                    placeholder="Maria Joaquina"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código
                  </label>
                  <Input
                    type="text"
                    placeholder="123456"
                    value={clientCode}
                    onChange={(e) => setClientCode(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            ) : (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="admin@smartinfo.co.mz"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            )}

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>
                Ao usar SmartInfo, você concorda com nossos{' '}
                <Link href="#" className="text-primary hover:underline">
                  termos de serviço
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-xl p-4 text-white/90 text-sm">
          <p className="font-semibold mb-2">Credenciais de demonstração:</p>
          <p className="text-xs">👤 Cliente — Nome: <span className="font-mono bg-white/20 px-1 rounded">Maria Joaquina</span> | Código: <span className="font-mono bg-white/20 px-1 rounded">123456</span></p>
          <p className="text-xs mt-1">🛡️ Admin — Email: <span className="font-mono bg-white/20 px-1 rounded">admin@smartinfo.co.mz</span> | Senha: <span className="font-mono bg-white/20 px-1 rounded">admin123</span></p>
        </div>
      </div>
    </div>
  )
}
