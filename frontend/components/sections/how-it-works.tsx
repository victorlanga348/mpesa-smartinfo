'use client'

import { motion } from 'framer-motion'
import { Smartphone, MapPin, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react'

export function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      icon: Smartphone,
      title: 'Abrir Aplicação',
      description: 'Inicia o SmartInfo no teu smartphone'
    },
    {
      number: '02',
      icon: MapPin,
      title: 'Ver Agentes no Mapa',
      description: 'Visualiza agentes disponíveis próximos de ti em tempo real'
    },
    {
      number: '03',
      icon: MessageSquare,
      title: 'Falar com Agente',
      description: 'Comunica diretamente sem expor teu saldo'
    },
    {
      number: '04',
      icon: CheckCircle,
      title: 'Confirmar Disponibilidade',
      description: 'Confirma se o agente consegue atender antes de te deslocares'
    },
    {
      number: '05',
      icon: ArrowRight,
      title: 'Deslocar-se com Segurança',
      description: 'Vai para o agente sabendo que será atendido'
    },
  ]

  return (
    <section id="como-funciona" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
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
            Como Funciona
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            5 passos simples para encontrar agentes e confirmar disponibilidade.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting Line - Desktop */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-transparent" />

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
            {steps.map((step, idx) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {/* Step Card */}
                  <div className="bg-white rounded-xl border border-border p-6 h-full relative z-10 hover:shadow-lg transition-shadow">
                    {/* Step Number */}
                    <div className="text-5xl font-bold text-primary/10 mb-4">{step.number}</div>

                    {/* Icon */}
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>

                    {/* Content */}
                    <h3 className="font-bold text-lg text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>

                    {/* Arrow - Desktop */}
                    {idx < steps.length - 1 && (
                      <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-20">
                        <div className="w-8 h-8 bg-white border-2 border-primary rounded-full flex items-center justify-center">
                          <ArrowRight className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Arrow - Mobile */}
                  {idx < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center my-4">
                      <ArrowRight className="w-6 h-6 text-primary rotate-90" />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-lg text-foreground mb-4">
            Pronto para começar?
          </p>
          <button className="inline-flex items-center justify-center px-8 py-3 font-semibold rounded-lg bg-primary text-white hover:bg-red-700 transition-colors">
            Encontrar Agentes Agora
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
