'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Clock, LocateFixed, MapPin, Search } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-white via-white to-secondary/30 px-4 pb-14 pt-24 sm:px-6 sm:pb-16 sm:pt-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mb-4 inline-flex rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-primary"
            >
              Feito para o dia a dia
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.25 }}
              className="mb-5 max-w-xl text-4xl font-black leading-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Veja o agente antes de sair.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.35 }}
              className="mb-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              Encontre agentes M-Pesa perto de si e evite sair sem saber se ha atendimento.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.45 }}
              className="mb-8 max-w-lg text-base text-foreground/70"
            >
              Tambem pode testar se compensa levantar dinheiro ou pagar digitalmente.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.55 }}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <Button asChild className="h-12 rounded-full bg-primary px-8 text-base font-bold text-white shadow-lg shadow-red-600/20 hover:bg-red-700">
                <Link href="/map">
                  Procurar agente
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-full border-red-200 px-8 text-base font-bold"
              >
                <Link href="/login">Sou agente</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.65 }}
              className="mt-9 grid grid-cols-3 gap-3 border-t border-border pt-6 sm:gap-4"
            >
              {[
                { number: 'Mapa', label: 'Veja onde esta' },
                { number: 'Pedido', label: 'Agente confirma' },
                { number: 'Poupanca', label: 'Compare custos' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-lg font-black text-primary sm:text-2xl">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.2 }}
            className="relative"
          >
            <div className="relative mx-auto w-full max-w-[390px] sm:max-w-[460px] lg:max-w-[520px]">
              <div className="rounded-[2rem] bg-black p-3 shadow-2xl">
                <div className="overflow-hidden rounded-[1.6rem] bg-white">
                  <div className="flex items-center justify-between bg-gray-100 px-6 py-3 text-xs font-bold text-gray-700">
                    <span>9:41</span>
                    <span>SmartInfo</span>
                    <span>LTE</span>
                  </div>

                  <div className="relative h-[500px] bg-[#eef4f1] sm:h-[540px]">
                    <div className="absolute left-4 right-4 top-4 z-10 rounded-lg border border-white/70 bg-white/95 p-3 shadow-xl">
                      <div className="flex h-11 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3">
                        <Search className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-900">Xipamanine</span>
                        <span className="ml-auto rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">Ver</span>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-gray-700">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                        2 agentes prontos nesta zona
                      </div>
                    </div>

                    <div className="absolute inset-0">
                      <div className="absolute left-8 top-36 h-28 w-48 rotate-[-18deg] rounded-full border-2 border-red-500/35 bg-red-500/10" />
                      <div className="absolute left-0 top-56 h-2 w-full rotate-[-12deg] bg-white/80" />
                      <div className="absolute left-0 top-72 h-2 w-full rotate-[16deg] bg-white/80" />
                      <div className="absolute left-24 top-28 h-full w-2 rotate-[8deg] bg-white/80" />
                      <div className="absolute right-20 top-24 h-full w-2 rotate-[-10deg] bg-white/80" />

                      <motion.div
                        animate={{ scale: [1, 1.12, 1] }}
                        transition={{ duration: 1.8, repeat: Infinity }}
                        className="absolute left-[46%] top-[42%]"
                      >
                        <div className="grid h-8 w-8 place-items-center rounded-full border-4 border-white bg-blue-600 shadow-[0_0_0_12px_rgba(37,99,235,.15)]">
                          <LocateFixed className="h-4 w-4 text-white" />
                        </div>
                        <span className="absolute left-8 top-1 whitespace-nowrap rounded-full bg-blue-600 px-2 py-1 text-[10px] font-bold text-white">
                          Voce
                        </span>
                      </motion.div>

                      {[
                        { left: '20%', top: '34%', name: 'Joao', state: 'Online' },
                        { left: '66%', top: '45%', name: 'Fatima', state: 'Online' },
                        { left: '54%', top: '65%', name: 'Maria', state: 'Ocupado' },
                      ].map((agent, index) => (
                        <motion.div
                          key={agent.name}
                          animate={{ y: [0, -7, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
                          className="absolute"
                          style={{ left: agent.left, top: agent.top }}
                        >
                          <div className={`grid h-10 w-10 place-items-center rounded-full border-[3px] border-white text-sm font-black text-white shadow-xl ${agent.state === 'Online' ? 'bg-green-600' : 'bg-yellow-500'}`}>
                            M
                          </div>
                          <div className="mt-1 rounded-md bg-white px-2 py-1 text-[10px] font-bold text-gray-800 shadow">
                            {agent.name}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 z-20 rounded-t-2xl bg-white p-4 shadow-2xl">
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-sm font-black text-gray-900">
                            <MapPin className="h-4 w-4 text-red-600" />
                            Fatima Muandal
                          </div>
                          <p className="mt-1 text-xs text-gray-500">Agente M-Pesa perto do mercado</p>
                        </div>
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                          Online
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="rounded-lg bg-gray-50 p-2 text-center">
                          <div className="text-xs text-gray-500">Valor</div>
                          <div className="font-black text-gray-900">1000 MT</div>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-2 text-center">
                          <div className="text-xs text-gray-500">Espera</div>
                          <div className="font-black text-gray-900">10 min</div>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-2 text-center">
                          <div className="text-xs text-gray-500">Estado</div>
                          <div className="font-black text-green-700">Disponivel</div>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 text-sm font-bold text-white">
                          <Clock className="h-4 w-4" />
                          Pedir espera
                        </button>
                        <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 text-sm font-bold text-green-700">
                          <CheckCircle className="h-4 w-4" />
                          Cheguei
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.6, repeat: Infinity }}
                className="absolute -bottom-5 left-6 rounded-lg border border-green-200 bg-white px-4 py-3 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-sm font-black text-gray-900">Simples de usar</div>
                    <div className="text-xs text-gray-500">Mapa, agente e poupanca</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
