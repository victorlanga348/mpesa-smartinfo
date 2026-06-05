'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Shield, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authService } from '@/lib/services'
import { getApiUrl } from '@/lib/socket'

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'client' | 'admin'>('client')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const router = useRouter()

  const handleClientLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!clientName || !clientPhone) throw new Error('Preencha o nome e o numero.')
      await authService.registerClient(clientName, clientPhone)
      router.push('/app/map')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login falhou.')
    } finally {
      setLoading(false)
    }
  }

  const handleAdminLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!adminEmail || !adminPassword) throw new Error('Preencha o email e a palavra-passe.')

      const response = await fetch(`${getApiUrl()}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Nao foi possivel entrar.')

      localStorage.setItem('smartinfo_user', JSON.stringify({ ...data.user, token: data.token, type: 'admin', role: 'admin' }))
      router.push('/app/admin-dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login falhou.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#E60000] p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white">M-Pesa SmartInfo</h1>
          <p className="mt-2 text-white/85">Saiba antes de sair.</p>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow-xl">
          <div className="flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => { setActiveTab('client'); setError('') }}
              className={`flex flex-1 items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'client' ? 'border-b-2 border-[#E60000] bg-red-50 text-[#E60000]' : 'text-gray-600'
              }`}
            >
              <User className="size-4" />
              Cliente
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('admin'); setError('') }}
              className={`flex flex-1 items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'admin' ? 'border-b-2 border-[#E60000] bg-red-50 text-[#E60000]' : 'text-gray-600'
              }`}
            >
              <Shield className="size-4" />
              Admin
            </button>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {activeTab === 'client' ? (
              <form onSubmit={handleClientLogin} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Nome</label>
                  <Input value={clientName} onChange={(event) => setClientName(event.target.value)} placeholder="Nome registado" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Numero</label>
                  <Input value={clientPhone} onChange={(event) => setClientPhone(event.target.value)} placeholder="84 xxx xxxx" required />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-[#E60000] text-white hover:bg-red-700">
                  {loading ? 'A entrar...' : 'Entrar'}
                  <ArrowRight className="size-4" />
                </Button>
              </form>
            ) : (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Email institucional</label>
                  <Input type="email" value={adminEmail} onChange={(event) => setAdminEmail(event.target.value)} placeholder="email da equipa" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Palavra-passe</label>
                  <Input type="password" value={adminPassword} onChange={(event) => setAdminPassword(event.target.value)} placeholder="Palavra-passe" required />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-[#E60000] text-white hover:bg-red-700">
                  {loading ? 'A entrar...' : 'Entrar'}
                  <ArrowRight className="size-4" />
                </Button>
              </form>
            )}

            <p className="mt-6 text-center text-sm text-gray-600">
              Agentes entram pela pagina de agente. <Link href="/login" className="font-semibold text-[#E60000] hover:underline">Ir para acesso completo</Link>
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-white/15 p-4 text-sm text-white/90">
          <p className="font-semibold">Acesso operacional</p>
          <p className="mt-1 text-xs leading-5">Use credenciais fornecidas pela equipa do piloto. Nao sao apresentadas contas ficticias nesta tela.</p>
        </div>
      </div>
    </div>
  )
}
