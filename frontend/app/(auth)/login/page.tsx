'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Home, Shield, Smartphone, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { authService } from '@/lib/services'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('customer')
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [agentPhone, setAgentPhone] = useState('')
  const [agentPassword, setAgentPassword] = useState('')

  const handleClientLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!clientName || !clientPhone) throw new Error('Preencha o nome e o numero M-Pesa.')
      await authService.loginClient(clientName, clientPhone)
      router.push('/app/map')
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || 'Erro ao entrar.')
      setLoading(false)
    }
  }

  const handleAdminLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!adminEmail || !adminPassword) throw new Error('Preencha o email e a palavra-passe.')
      await authService.loginAdmin(adminEmail, adminPassword)
      router.push('/app/admin-dashboard')
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || 'Erro ao entrar.')
      setLoading(false)
    }
  }

  const handleAgentLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!agentPhone || !agentPassword) throw new Error('Preencha telefone e palavra-passe do agente.')
      await authService.loginAgent(agentPhone, agentPassword)
      router.push('/app/agent-dashboard')
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || 'Erro ao entrar.')
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center">
          <div className="flex size-12 items-center justify-center rounded-lg bg-[#E60000]">
            <Smartphone className="size-6 text-white" />
          </div>
          <h1 className="ml-3 text-2xl font-bold text-gray-900">M-Pesa SmartInfo</h1>
        </div>

        <div className="mb-5 flex justify-center">
          <Button asChild variant="outline" className="border-red-200 bg-white text-[#E60000] hover:bg-red-50">
            <Link href="/">
              <Home className="mr-2 size-4" />
              Voltar a pagina inicial
            </Link>
          </Button>
        </div>

        <h2 className="mb-2 text-center text-3xl font-bold text-gray-900">Entrar</h2>
        <p className="mb-8 text-center text-gray-600">
          Acesso para clientes, agentes e equipa operacional.
        </p>

        <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value); setError('') }} className="mb-6 w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="customer" className="gap-1.5">
              <User className="size-3.5" />
              Cliente
            </TabsTrigger>
            <TabsTrigger value="agent" className="gap-1.5">
              <Smartphone className="size-3.5" />
              Agente
            </TabsTrigger>
            <TabsTrigger value="admin" className="gap-1.5">
              <Shield className="size-3.5" />
              Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="customer">
            <AccessFormError error={error} active={activeTab === 'customer'} />
            <form onSubmit={handleClientLogin} className="space-y-4">
              <Field label="Nome" value={clientName} onChange={setClientName} placeholder="Nome registado" />
              <Field label="Numero M-Pesa" value={clientPhone} onChange={setClientPhone} placeholder="84 xxx xxxx" type="tel" />
              <SubmitButton loading={loading} />
            </form>
          </TabsContent>

          <TabsContent value="agent">
            <AccessFormError error={error} active={activeTab === 'agent'} />
            <form onSubmit={handleAgentLogin} className="space-y-4">
              <Field label="Telefone do agente" value={agentPhone} onChange={setAgentPhone} placeholder="84 xxx xxxx" type="tel" />
              <Field label="Palavra-passe" value={agentPassword} onChange={setAgentPassword} placeholder="Palavra-passe" type="password" />
              <SubmitButton loading={loading} />
            </form>
          </TabsContent>

          <TabsContent value="admin">
            <AccessFormError error={error} active={activeTab === 'admin'} />
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <Field label="Email institucional" value={adminEmail} onChange={setAdminEmail} placeholder="email da equipa" type="email" />
              <Field label="Palavra-passe" value={adminPassword} onChange={setAdminPassword} placeholder="Palavra-passe" type="password" />
              <SubmitButton loading={loading} />
            </form>
          </TabsContent>
        </Tabs>

        <p className="text-center text-sm text-gray-600">
          Use credenciais fornecidas pela equipa do piloto. O sistema nao apresenta contas ficticias.
        </p>
      </div>
    </main>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  type?: string
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <Input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full"
      />
    </div>
  )
}

function AccessFormError({ error, active }: { error: string; active: boolean }) {
  if (!error || !active) return null

  return (
    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {error}
    </div>
  )
}

function SubmitButton({ loading }: { loading: boolean }) {
  return (
    <Button type="submit" disabled={loading} className="w-full bg-[#E60000] py-3 font-semibold text-white hover:bg-red-700">
      {loading ? 'A entrar...' : 'Entrar'}
    </Button>
  )
}
