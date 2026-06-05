'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { authService } from '@/lib/services'
import { getErrorMessage } from '@/lib/runtime'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    neighborhood: '',
    type: 'customer' as 'customer' | 'agent',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value as 'customer' | 'agent' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!formData.name || !formData.phone || !formData.neighborhood) {
        throw new Error('Preencha todos os campos')
      }

      const user = await authService.register(
        formData.name,
        formData.phone,
        formData.neighborhood,
        formData.type
      )

      // Store user in localStorage
      localStorage.setItem('smartinfo_user', JSON.stringify(user))

      // Redirect based on type
      if (formData.type === 'agent') {
        router.push('/agent-dashboard')
      } else {
        router.push('/app/map')
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Erro ao registrar'))
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 to-white flex flex-col items-center justify-center p-4">
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

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Cadastro</h2>
        <p className="text-gray-600 text-center mb-8">Crie sua conta para começar</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="João Silva"
              disabled={loading}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número M-Pesa</label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="843456789"
              disabled={loading}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
            <Input
              type="text"
              name="neighborhood"
              value={formData.neighborhood}
              onChange={handleChange}
              placeholder="Xipamanine"
              disabled={loading}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de conta</label>
            <Select value={formData.type} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Cliente</SelectItem>
                <SelectItem value="agent">Agente M-Pesa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? 'Registrando...' : 'Criar Conta'}
          </Button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-600 mt-6">
          Já tem conta?{' '}
          <Link href="/login" className="text-red-600 font-semibold hover:text-red-700">
            Entrar
          </Link>
        </p>
      </motion.div>
    </main>
  )
}
