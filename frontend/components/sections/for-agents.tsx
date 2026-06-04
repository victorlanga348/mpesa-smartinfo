'use client'

import { motion } from 'framer-motion'
import { Users, TrendingUp, Clock, Shield, BarChart3, Zap } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function ForAgentsSection() {
  const benefits = [
    {
      icon: Users,
      title: 'Mais Clientes',
      description: 'Recebe clientes confiantes e pré-confirmados',
      color: 'bg-blue-50 text-info'
    },
    {
      icon: TrendingUp,
      title: 'Mais Organização',
      description: 'Gerencia melhor o fluxo de atendimento',
      color: 'bg-accent/10 text-accent'
    },
    {
      icon: Clock,
      title: 'Menos Confusão',
      description: 'Sem pessoas a aparecer de surpresa',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: Shield,
      title: 'Privacidade Total',
      description: 'Controla quando mostras teu saldo',
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      icon: BarChart3,
      title: 'Análise de Dados',
      description: 'Visualiza métricas de atendimento e padrões',
      color: 'bg-orange-50 text-orange-600'
    },
    {
      icon: Zap,
      title: 'Dashboard Intuitivo',
      description: 'Interface simples e fácil de usar',
      color: 'bg-yellow-50 text-yellow-600'
    },
  ]

  return (
    <section id="agentes" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Para Agentes M-Pesa
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transforma a forma como trabalhas e aumenta o teu rendimento
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Benefits List */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {benefits.slice(0, 3).map((benefit, idx) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-4"
                >
                  <div className={`w-12 h-12 rounded-lg ${benefit.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl border border-border p-6 shadow-lg"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <h3 className="font-bold text-foreground">Dashboard do Agente</h3>
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Clientes Hoje</div>
                  <div className="text-2xl font-bold text-primary">24</div>
                </div>
                <div className="bg-secondary p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Rendimento</div>
                  <div className="text-2xl font-bold text-accent">1.200 MT</div>
                </div>
              </div>

              {/* Status */}
              <div className="bg-accent/10 border border-accent rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-foreground">Status</div>
                    <div className="text-sm text-accent">Online e Ativo</div>
                  </div>
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                </div>
              </div>

              {/* Pending Requests */}
              <div className="bg-warning/10 border border-warning rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-foreground">Pedidos Pendentes</div>
                    <div className="text-sm text-warning">3 clientes à espera</div>
                  </div>
                  <div className="text-xl font-bold text-warning">3</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* More Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {benefits.slice(3).map((benefit, idx) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 rounded-lg ${benefit.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary to-red-600 rounded-2xl p-12 text-white text-center"
        >
          <h3 className="text-3xl font-bold mb-4">Pronto para Ganhar Mais?</h3>
          <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
            Junta-te à rede de agentes SmartInfo e aumenta o teu rendimento com melhor organização e mais clientes confiantes
          </p>
          <Button asChild className="bg-white text-primary hover:bg-secondary font-semibold px-8 py-3">
            <Link href="/register">Quero ser Agente SmartInfo</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
