'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export function FormSection() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Pronto para Começar?
          </h2>
          <p className="text-lg text-muted-foreground">
            Deixa os teus dados e junta-te à comunidade SmartInfo
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="bg-secondary/30 rounded-2xl border border-border p-8 md:p-12"
        >
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Nome Completo</label>
              <Input
                type="text"
                placeholder="João Silva"
                required
                className="bg-white border-border"
              />
            </div>

            {/* M-Pesa Number */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Número M-Pesa</label>
              <Input
                type="tel"
                placeholder="+258 82 XXX XXXX"
                required
                className="bg-white border-border"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Bairro/Localização</label>
              <Input
                type="text"
                placeholder="Ex: Polana, Malhangalene, Chamanculo"
                required
                className="bg-white border-border"
              />
            </div>

            {/* How You Heard */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Como nos conheceu?</label>
              <Select>
                <SelectTrigger className="bg-white border-border">
                  <SelectValue placeholder="Selecionar opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="agente">Agente M-Pesa</SelectItem>
                  <SelectItem value="amigo">Amigo</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Main Problem */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-2">Qual é o seu principal problema?</label>
              <Select>
                <SelectTrigger className="bg-white border-border">
                  <SelectValue placeholder="Selecionar opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="encontrar">Encontrar agentes</SelectItem>
                  <SelectItem value="saldo">Agentes sem saldo</SelectItem>
                  <SelectItem value="distancia">Distância</SelectItem>
                  <SelectItem value="filas">Filas</SelectItem>
                  <SelectItem value="informacao">Falta de informação</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Frequency */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-2">Com que frequência usa M-Pesa?</label>
              <Select>
                <SelectTrigger className="bg-white border-border">
                  <SelectValue placeholder="Selecionar opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diario">Todos os dias</SelectItem>
                  <SelectItem value="semanal">Algumas vezes por semana</SelectItem>
                  <SelectItem value="raro">Raramente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Message */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-2">Mensagem (Opcional)</label>
              <Textarea
                placeholder="Deixa-nos saber o que mais desejas do SmartInfo..."
                className="bg-white border-border resize-none"
                rows={4}
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: submitted ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-red-700 text-white font-semibold py-6 text-base"
            >
              Entrar no SmartInfo
            </Button>
          </motion.div>

          {/* Success Message */}
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4 bg-accent/10 border border-accent rounded-lg text-center"
            >
              <p className="text-accent font-semibold">Obrigado! Em breve entraremos em contacto.</p>
            </motion.div>
          )}

          {/* Trust Text */}
          <p className="text-sm text-muted-foreground text-center mt-6">
            Respeitamos a sua privacidade. Nunca compartilharemos seus dados sem consentimento.
          </p>
        </motion.form>
      </div>
    </section>
  )
}
