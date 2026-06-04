'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

export function SocialProofSection() {
  const testimonials = [
    {
      name: 'Amina, Cliente Rural',
      avatar: '👩',
      role: 'Utilizadora da Zona Rural',
      quote: 'Antes eu andava muito para encontrar agentes sem dinheiro. Agora confirmo antes de sair e posso trabalhar melhor. Mudou a minha vida.',
      rating: 5,
      location: 'Gaza'
    },
    {
      name: 'João, Agente M-Pesa',
      avatar: '👨',
      role: 'Agente Operacional',
      quote: 'Consigo organizar melhor os clientes e evitar confusão. As pessoas sabem que tenho saldo e vêm com confiança. Ganho mais clientes.',
      rating: 5,
      location: 'Maputo'
    },
    {
      name: 'Maria, Estudante',
      avatar: '👩‍🎓',
      role: 'Utilizadora Urbana',
      quote: 'Poupei tempo e chapa usando o SmartInfo. Antes gastava 1.200 MT por semana em deslocações. Agora são 300 MT.',
      rating: 5,
      location: 'Beira'
    },
  ]

  const stats = [
    { number: '+3.000', label: 'Utilizadores Ativos' },
    { number: '+500', label: 'Agentes Cadastrados' },
    { number: '60%', label: 'Menos Deslocações sem Sucesso' },
    { number: '1.200 MT', label: 'Média de Poupança Mensal' },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
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
            Confiança da Comunidade
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Milhares de moçambicanos já utilizam o SmartInfo e transformaram suas vidas financeiras
          </p>
        </motion.div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-shadow"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground font-medium mb-6 leading-relaxed">
                &quot;{testimonial.quote}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                  <div className="text-xs text-primary font-medium">{testimonial.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl border border-border p-12"
        >
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-6">Confiado por instituições e reguladores moçambicanos</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {['Vodacom', 'BIM', 'MEL', 'Banco de Moçambique'].map((partner, idx) => (
              <div key={idx} className="text-sm font-semibold text-foreground/50 px-4 py-2 border border-border rounded-lg">
                {partner}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
