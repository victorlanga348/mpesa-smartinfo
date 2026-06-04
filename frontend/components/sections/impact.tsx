'use client'

import { motion } from 'framer-motion'
import { Heart, TrendingUp, Users } from 'lucide-react'

export function ImpactSection() {
  const impacts = [
    {
      icon: Heart,
      title: 'Impacto Social',
      items: [
        'Menos sofrimento e frustração',
        'Menos filas e esperas',
        'Mais inclusão financeira',
        'Fortalecimento comunitário'
      ],
      color: 'from-red-50 to-pink-50'
    },
    {
      icon: TrendingUp,
      title: 'Impacto Económico',
      items: [
        'Menos gastos em transporte',
        'Mais retenção digital',
        'Maior confiança no M-Pesa',
        'Aumento da adopção financeira'
      ],
      color: 'from-green-50 to-emerald-50'
    },
    {
      icon: Users,
      title: 'Impacto Operacional',
      items: [
        'Gestão de zonas críticas',
        'Reforço automático',
        'Melhor distribuição',
        'Dados para decisões'
      ],
      color: 'from-blue-50 to-cyan-50'
    },
  ]

  return (
    <section id="impacto" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
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
            Impacto Real em Moçambique
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            O SmartInfo não é apenas uma aplicação. É uma transformação nos três níveis que importam.
          </p>
        </motion.div>

        {/* Impact Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {impacts.map((impact, idx) => {
            const Icon = impact.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`rounded-2xl p-8 bg-gradient-to-br ${impact.color} border border-border hover:shadow-lg transition-shadow`}
              >
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-6">{impact.title}</h3>
                <ul className="space-y-3">
                  {impact.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-2xl font-bold text-foreground mb-4 text-balance">
            Juntos, criamos uma rede de confiança financeira.
          </p>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Cada utilizador, cada agente e cada transacção contribuem para um Moçambique mais inclusivo,
            digital e confiante. O SmartInfo é a ponte entre o presente e esse futuro.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
