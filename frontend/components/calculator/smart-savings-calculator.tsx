'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, Clock, Coins, Info, TrendingUp, Wallet } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type SavingsLevel = 'Baixa Poupanca' | 'Media Poupanca' | 'Alta Poupanca'

function estimateWithdrawalFee(amount: number) {
  return Math.max(2, Math.round(amount * 0.01))
}

function getSavingsLevel(savings: number): { label: SavingsLevel; color: string; bg: string } {
  if (savings >= 50) return { label: 'Alta Poupanca', color: 'text-[#16A34A]', bg: 'bg-[#16A34A]' }
  if (savings >= 20) return { label: 'Media Poupanca', color: 'text-yellow-600', bg: 'bg-yellow-500' }
  return { label: 'Baixa Poupanca', color: 'text-[#E60000]', bg: 'bg-[#E60000]' }
}

function educationalMessage(level: SavingsLevel) {
  if (level === 'Alta Poupanca') {
    return 'Pagamentos digitais reduzem deslocacoes e ajudam a manter o dinheiro seguro.'
  }
  if (level === 'Media Poupanca') {
    return 'Evitar levantamentos desnecessarios pode reduzir custos de transporte.'
  }
  return 'Usar dinheiro digital ajuda a economizar tempo e aumenta a seguranca.'
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)
  const previousValueRef = useRef(0)

  useEffect(() => {
    let frame = 0
    const totalFrames = 24
    const start = previousValueRef.current
    const diff = value - start
    const timer = window.setInterval(() => {
      frame += 1
      const progress = Math.min(frame / totalFrames, 1)
      const nextValue = Math.round(start + diff * progress)
      setDisplay(nextValue)
      if (progress === 1) {
        previousValueRef.current = value
        window.clearInterval(timer)
      }
    }, 20)

    return () => window.clearInterval(timer)
  }, [value])

  return <>{display.toLocaleString('pt-MZ')}</>
}

export function SmartSavingsCalculator({ embedded = false }: { embedded?: boolean }) {
  const [amount, setAmount] = useState(2000)
  const [distance, setDistance] = useState(3)
  const [transportCost, setTransportCost] = useState(20)
  const [travelTime, setTravelTime] = useState(30)
  const [calculated, setCalculated] = useState(false)

  const result = useMemo(() => {
    const withdrawalFee = estimateWithdrawalFee(amount)
    const cashTotal = amount + transportCost + withdrawalFee
    const digitalCost = 0
    const digitalTime = 1
    const digitalTotal = amount + digitalCost
    const moneySaved = Math.max(0, cashTotal - digitalTotal)
    const timeSaved = Math.max(0, travelTime - digitalTime)
    const level = getSavingsLevel(moneySaved)

    return {
      withdrawalFee,
      cashTotal,
      digitalCost,
      digitalTime,
      digitalTotal,
      moneySaved,
      timeSaved,
      level,
      message: educationalMessage(level.label),
    }
  }, [amount, transportCost, travelTime])

  const content = (
    <>
      {!embedded && (
      <header className="sticky top-0 z-40 border-b border-red-100/70 bg-white/90 p-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md items-center gap-4">
          <Link href="/app/map">
            <button className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white shadow-sm transition-colors hover:bg-red-50">
              <ArrowLeft className="h-5 w-5 text-[#4A4A4A]" />
            </button>
          </Link>
          <div>
            <h1 className="text-lg font-black text-[#4A4A4A]">Calculadora de Poupanca Inteligente</h1>
            <p className="text-xs text-gray-500">M-Pesa SmartInfo</p>
          </div>
        </div>
      </header>
      )}

      <div className={`mx-auto space-y-5 ${embedded ? 'max-w-md p-0' : 'max-w-5xl p-4 pb-20'}`}>
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-red-100 bg-[#E60000] p-5 text-white shadow-xl shadow-red-600/15 sm:p-6"
        >
          <Wallet className="mb-4 h-9 w-9" />
          <h2 className="text-3xl font-black leading-tight">Quanto pode poupar hoje?</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/85">
            Compare o custo de levantar dinheiro com o custo de pagar digitalmente.
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className={`${embedded ? 'space-y-4' : 'grid gap-4 md:grid-cols-2'} rounded-lg border border-gray-100 bg-white p-5 shadow-sm sm:p-6`}
        >
          <div>
            <label className="mb-2 block text-sm font-bold text-[#4A4A4A]">Valor da transaccao (MT)</label>
            <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} className="h-12 rounded-lg text-lg font-black" />
            <p className="mt-1 text-xs text-gray-400">Exemplo: 2000</p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-[#4A4A4A]">Distancia ate ao agente (km)</label>
            <Input type="number" value={distance} onChange={(e) => setDistance(Number(e.target.value) || 0)} className="h-12 rounded-lg text-lg font-black" />
            <p className="mt-1 text-xs text-gray-400">Exemplo: 3</p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-[#4A4A4A]">Custo de transporte (opcional)</label>
            <Input type="number" value={transportCost} onChange={(e) => setTransportCost(Number(e.target.value) || 0)} className="h-12 rounded-lg text-lg font-black" />
            <p className="mt-1 text-xs text-gray-400">Exemplo: 20 MT</p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-[#4A4A4A]">Tempo estimado da deslocacao (minutos)</label>
            <Input type="number" value={travelTime} onChange={(e) => setTravelTime(Number(e.target.value) || 0)} className="h-12 rounded-lg text-lg font-black" />
            <p className="mt-1 text-xs text-gray-400">Exemplo: 30</p>
          </div>

          <Button
            onClick={() => setCalculated(true)}
            className="h-12 w-full rounded-full bg-[#E60000] text-base font-black text-white shadow-lg shadow-red-600/20 hover:bg-red-700 md:col-span-2"
          >
            Calcular
          </Button>
        </motion.section>

        {calculated && (
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <motion.div
              whileHover={{ y: -2 }}
              className="rounded-lg border border-green-200 bg-green-50 p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-[#16A34A] text-white">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-green-800">Resultado principal</p>
                  <h3 className="text-3xl font-black text-[#16A34A]">
                    Pode poupar <AnimatedNumber value={result.moneySaved} /> MT
                  </h3>
                  <p className="text-sm font-semibold text-green-800">ou cerca de {result.timeSaved} minutos</p>
                </div>
              </div>
            </motion.div>

            <div className="grid gap-3 sm:grid-cols-2">
              <motion.div whileHover={{ y: -2 }} className="rounded-lg border border-red-100 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2 text-[#E60000]">
                  <Coins className="h-5 w-5" />
                  <h4 className="text-sm font-black">LEVANTAR DINHEIRO</h4>
                </div>
                <CostLine label="Valor" value={`${amount} MT`} />
                <CostLine label="Transporte" value={`${transportCost} MT`} />
                <CostLine label="Tempo" value={`${travelTime} min`} />
                <CostLine label="Taxa estimada" value={`${result.withdrawalFee} MT`} />
                <div className="mt-3 border-t pt-3">
                  <CostLine label="Custo total" value={`${result.cashTotal} MT`} strong />
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -2 }} className="rounded-lg border border-green-100 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2 text-[#16A34A]">
                  <TrendingUp className="h-5 w-5" />
                  <h4 className="text-sm font-black">PAGAR DIGITALMENTE</h4>
                </div>
                <CostLine label="Valor" value={`${amount} MT`} />
                <CostLine label="Tempo" value={`${result.digitalTime} min`} />
                <CostLine label="Custo estimado" value={`${result.digitalCost} MT`} />
                <div className="mt-3 border-t pt-3">
                  <CostLine label="Custo total" value={`${result.digitalTotal} MT`} strong />
                </div>
              </motion.div>
            </div>

            <motion.div whileHover={{ y: -2 }} className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-black text-[#4A4A4A]">Nivel de poupanca</span>
                <span className={`text-sm font-black ${result.level.color}`}>{result.level.label}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: result.level.label === 'Alta Poupanca' ? '100%' : result.level.label === 'Media Poupanca' ? '62%' : '32%' }}
                  className={`h-full rounded-full ${result.level.bg}`}
                />
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} className="rounded-lg border border-blue-100 bg-blue-50 p-5 shadow-sm">
              <div className="flex gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
                <div>
                  <h4 className="font-black text-blue-900">Literacia financeira</h4>
                  <p className="mt-2 text-sm leading-relaxed text-blue-900">{result.message}</p>
                  <p className="mt-3 text-sm font-bold text-[#4A4A4A]">
                    Nem sempre levantar dinheiro e a opcao mais economica.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.section>
        )}
      </div>
    </>
  )

  if (embedded) {
    return <div className="bg-[#FFFFFF] text-[#4A4A4A]">{content}</div>
  }

  return (
    <main className="min-h-screen bg-[#FFFFFF] text-[#4A4A4A]">
      {content}
    </main>
  )
}

function CostLine({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1 text-xs">
      <span className="text-gray-500">{label}</span>
      <span className={strong ? 'font-black text-[#4A4A4A]' : 'font-bold text-[#4A4A4A]'}>{value}</span>
    </div>
  )
}
