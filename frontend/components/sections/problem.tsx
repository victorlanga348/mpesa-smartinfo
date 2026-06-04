'use client'

import { motion } from 'framer-motion'
import { AlertCircle, MapPin, Clock, Frown, DollarSign } from 'lucide-react'

export function ProblemSection() {
  const problems = [
    {
      icon: AlertCircle,
      title: 'Agentes Sem Saldo',
      description: 'Chega a um agente e ele não consegue atender',
      color: 'text-red-500'
    },
    {
      icon: MapPin,
      title: 'Longas Distâncias',
      description: 'Caminhas horas até encontrar um agente disponível',
      color: 'text-warning'
    },
    {
      icon: Clock,
      title: 'Filas Intermináveis',
      description: 'Esperas muito tempo sem saber se consegues atender',
      color: 'text-primary'
    },
    {
      icon: DollarSign,
      title: 'Gastos em Transporte',
      description: 'Perdes dinheiro em chapa sem sucesso nas viagens',
      color: 'text-blue-500'
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
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
            O Problema Real do Dia-a-Dia
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Milhares de moçambicanos enfrentam diariamente o desafio de encontrar agentes M-Pesa disponíveis.
          </p>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 md:p-12 mb-16 border border-red-100"
        >
          <div className="flex gap-4 items-start">
            <Frown className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Imagine esta situação...
              </h3>
              <p className="text-lg text-foreground/80 leading-relaxed">
                &quot;São 14h. Você precisa levantar 5.000 MT do M-Pesa. Sai de casa caminhando pelo bairro
                procurando um agente. Depois de 2 horas a caminhar e passar em 3 agentes, descobre que nenhum deles tem saldo.
                Já gastou 200 MT em chapa. Fica frustrado. Alguns nem respeitam o horário de atendimento ou te pedem
                comissões extras.&quot;
              </p>
              <p className="text-lg text-primary font-semibold mt-4">
                Isto não devia ser assim.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Problems Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, idx) => {
            const Icon = problem.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${problem.color}`} />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">{problem.title}</h3>
                <p className="text-sm text-muted-foreground">{problem.description}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Impact Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-foreground text-white rounded-2xl p-12 mt-16 text-center"
        >
          <h3 className="text-2xl font-bold mb-8">O Impacto Invisível</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">70%</div>
              <p className="text-white/80">dos utilizadores abandonam transacções digitais</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-warning mb-2">1.200 MT</div>
              <p className="text-white/80">gastos mensais em deslocações frustradas</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-info mb-2">3+ horas</div>
              <p className="text-white/80">perdidas por semana a procurar agentes</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
