'use client'

import { motion } from 'framer-motion'
import { MapPin, Radio, MessageSquare, Clock, Users, TrendingUp, Calculator, Zap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function FeaturesSection() {
  const features = [
    {
      icon: MapPin,
      title: 'Mapa Inteligente',
      description: 'Visualiza agentes online em tempo real com localização precisa',
      color: 'bg-red-50 text-primary'
    },
    {
      icon: Radio,
      title: 'Sistema de Ping',
      description: 'Confirma disponibilidade sem expor saldo do agente',
      color: 'bg-warning/10 text-warning'
    },
    {
      icon: MessageSquare,
      title: 'Chat Cliente ↔ Agente',
      description: 'Comunicação rápida e simples sem intermediários',
      color: 'bg-blue-50 text-info'
    },
    {
      icon: Clock,
      title: 'Reserva Inteligente',
      description: 'Organização automática de atendimento por ordem de chegada',
      color: 'bg-accent/10 text-accent'
    },
    {
      icon: Users,
      title: 'Referências Humanas',
      description: 'Localização com descrições locais: "Perto do mercado", "Ao lado da banca azul"',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: TrendingUp,
      title: 'Reforço Temporário',
      description: 'Cobertura automática de zonas críticas durante períodos de pico',
      color: 'bg-cyan-50 text-cyan-600'
    },
    {
      icon: Calculator,
      title: 'Calculadora de Poupança',
      description: 'Compara gastos: levantamento vs. pagamento digital',
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      icon: Zap,
      title: 'Confirmação Rápida',
      description: 'Resposta em segundos, não em horas',
      color: 'bg-orange-50 text-orange-600'
    },
  ]

  return (
    <section id="funcionalidades" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
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
            Funcionalidades Poderosas
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tecnologia desenvolvida especificamente para a realidade moçambicana
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                viewport={{ once: true }}
              >
                <Card className="border border-border h-full hover:shadow-lg transition-all hover:border-primary/20">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Feature Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 md:p-12 border border-primary/20"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Tecnologia Pensada para Moçambique</h3>
              <ul className="space-y-3">
                {[
                  'Funciona com internet lenta e instável',
                  'Interface simples e intuitiva',
                  'Suporta português e localizações moçambicanas',
                  'Respeita privacidade e segurança dos dados'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <span className="text-sm font-semibold text-foreground">Offline-first</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <span className="text-sm font-semibold text-foreground">Sem ads ou distrações</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <span className="text-sm font-semibold text-foreground">Notificações inteligentes</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
