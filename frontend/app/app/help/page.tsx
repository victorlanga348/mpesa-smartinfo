'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  HelpCircle,
  LifeBuoy,
  Map,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Wallet,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { formatMaintenanceDate, maintenanceInfo } from '@/lib/maintenance'

const faqItems = [
  {
    question: 'Como funciona o SmartInfo?',
    answer: 'O SmartInfo ajuda a confirmar se um agente consegue atender antes de se deslocar.',
  },
  {
    question: 'Preciso criar conta?',
    answer: 'Nao. Basta informar o seu nome e numero de telefone.',
  },
  {
    question: 'O sistema mostra quanto dinheiro o agente possui?',
    answer: 'Nao. O sistema apenas informa se o agente consegue ou nao atender o valor solicitado.',
  },
  {
    question: 'Como sei que o agente esta disponivel?',
    answer: 'Os agentes disponiveis aparecem no mapa e podem confirmar atendimento atraves do sistema.',
  },
  {
    question: 'O que significa "Estou a caminho"?',
    answer: 'E uma confirmacao enviada ao agente para indicar que esta a deslocar-se para o local.',
  },
  {
    question: 'O que e uma reserva?',
    answer: 'E uma prioridade temporaria criada apos o agente aceitar o pedido.',
  },
]

const quickExamples = [
  'Como encontrar um agente?',
  'Como enviar um pedido?',
  'O que significa agente disponivel?',
  'Como funciona a reserva?',
]

const steps = [
  'Escolha um agente no mapa.',
  'Clique em "Falar com agente".',
  'Informe o valor pretendido.',
  'Aguarde a resposta.',
  'Confirme que esta a caminho.',
  'Dirija-se ao local.',
]

const securityTips = [
  'Nunca partilhe o PIN M-Pesa.',
  'Nunca entregue o telemovel desbloqueado.',
  'Confirme sempre a identidade do agente.',
  'Utilize apenas agentes registados.',
  'O SmartInfo nunca mostra o saldo dos agentes.',
]

const financeCards: Array<{ title: string; text: string; icon: LucideIcon }> = [
  {
    title: 'Porque usar pagamentos digitais?',
    text: 'Pagamentos digitais reduzem o uso de dinheiro fisico e ajudam a manter historico das suas transaccoes.',
    icon: Wallet,
  },
  {
    title: 'Como evitar deslocacoes desnecessarias?',
    text: 'Confirme primeiro se o agente consegue atender o valor solicitado antes de sair de casa.',
    icon: Map,
  },
  {
    title: 'Como reduzir custos de transporte?',
    text: 'Procure agentes proximos e evite viagens quando o atendimento ainda nao foi confirmado.',
    icon: Clock,
  },
  {
    title: 'Vantagens do dinheiro digital?',
    text: 'Ajuda a pagar com rapidez, reduz riscos de perda e facilita o controlo do dinheiro.',
    icon: CheckCircle2,
  },
  {
    title: 'Como proteger a sua conta M-Pesa?',
    text: 'Guarde o PIN, confirme mensagens oficiais e nunca aceite ajuda de pessoas desconhecidas.',
    icon: ShieldCheck,
  },
]

const commonProblems = [
  {
    title: 'Nao encontro agentes',
    text: 'Verifique se o mapa carregou, aumente o raio de procura ou tente numa zona proxima com maior movimento.',
  },
  {
    title: 'O agente nao respondeu',
    text: 'Aguarde alguns minutos. Se nao houver resposta, escolha outro agente disponivel no mapa.',
  },
  {
    title: 'O pedido expirou',
    text: 'Pedidos expiram para proteger o seu tempo e a fila do agente. Envie um novo pedido quando ainda quiser atendimento.',
  },
  {
    title: 'O mapa nao carrega',
    text: 'Confirme a ligacao a internet, actualize a pagina e verifique se a localizacao esta activa no telemovel.',
  },
  {
    title: 'Nao consigo enviar pedido',
    text: 'Confirme se preencheu o valor, nome e telefone. Se o erro continuar, contacte o suporte.',
  },
]

export const dynamic = 'force-dynamic'

export default function HelpPage() {
  const [query, setQuery] = useState('')
  const [selectedProblem, setSelectedProblem] = useState(commonProblems[0])
  const scheduledAt = formatMaintenanceDate(maintenanceInfo.scheduledAt)
  const estimatedEndAt = formatMaintenanceDate(maintenanceInfo.estimatedEndAt)

  const filteredFaq = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return faqItems
    }

    return faqItems.filter((item) => {
      return `${item.question} ${item.answer}`.toLowerCase().includes(normalizedQuery)
    })
  }, [query])

  return (
    <div className="mx-auto max-w-6xl space-y-10 pb-10 text-[#4A4A4A]">
      <Button asChild variant="outline" className="rounded-full border-red-200 text-[#E60000] hover:bg-red-50">
        <Link href="/">
          <ArrowLeft className="size-4" />
          Voltar para pagina inicial
        </Link>
      </Button>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-lg bg-[#E60000] px-4 py-8 text-white shadow-sm sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-white/15">
            <LifeBuoy className="size-6" />
          </div>
          <h1 className="text-3xl font-black tracking-normal sm:text-4xl">
            Como podemos ajudar?
          </h1>
          <p className="mt-3 text-sm text-white/85 sm:text-base">
            Encontre respostas rapidas sobre agentes, pedidos, reservas, seguranca e uso do M-Pesa SmartInfo.
          </p>
          <div className="relative mt-6">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#E60000]" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Pesquisar ajuda..."
              className="h-12 rounded-lg border-white bg-white pl-12 pr-4 text-[#4A4A4A] shadow-none placeholder:text-gray-500"
            />
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {quickExamples.map((example) => (
              <button
                key={example}
                onClick={() => setQuery(example)}
                className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/20"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="rounded-lg border border-gray-200 bg-white px-4 py-5 shadow-sm sm:px-6"
        >
          <div className="mb-3 flex items-center gap-2">
            <HelpCircle className="size-5 text-[#E60000]" />
            <h2 className="text-xl font-black text-gray-900">Perguntas Frequentes</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {filteredFaq.map((item, index) => (
              <AccordionItem key={item.question} value={`faq-${index}`}>
                <AccordionTrigger className="text-base font-semibold text-gray-900 hover:text-[#E60000] hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-6 text-gray-600">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          {filteredFaq.length === 0 && (
            <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
              Nao encontramos uma resposta exacta. Veja os problemas comuns ou contacte o suporte.
            </p>
          )}
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="rounded-lg border border-gray-200 bg-white px-4 py-5 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-5 text-green-700" aria-hidden="true" />
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
              {maintenanceInfo.state === 'operational' ? 'Operacional' : 'Manutencao'}
            </p>
          </div>
          <div className="mt-3 space-y-2">
            <h2 className="text-lg font-black text-gray-900">{maintenanceInfo.title}</h2>
            <p className="text-sm leading-6 text-gray-600">{maintenanceInfo.description}</p>
            {scheduledAt && (
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Data: </span>
                {scheduledAt}
              </p>
            )}
            {estimatedEndAt && (
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Previsao: </span>
                {estimatedEndAt}
              </p>
            )}
            {maintenanceInfo.impact && (
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Impacto: </span>
                {maintenanceInfo.impact}
              </p>
            )}
          </div>
        </motion.aside>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white px-4 py-6 shadow-sm sm:px-6">
        <h2 className="text-2xl font-black text-gray-900">Como utilizar o SmartInfo</h2>
        <p className="mt-2 text-sm text-gray-600">Passo a Passo</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.28, delay: index * 0.04 }}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4"
            >
              <div className="flex size-9 items-center justify-center rounded-full bg-[#E60000] text-sm font-black text-white">
                {index + 1}
              </div>
              <p className="mt-4 text-sm font-semibold leading-6 text-gray-800">{step}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-red-100 bg-red-50 px-4 py-6 sm:px-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-6 text-[#E60000]" />
          <h2 className="text-2xl font-black text-gray-900">Dicas de Seguranca</h2>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {securityTips.map((tip) => (
            <div key={tip} className="flex gap-3 rounded-lg bg-white p-4 text-sm font-medium text-gray-700 shadow-sm">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[#E60000]" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-2xl font-black text-gray-900">Aprenda mais sobre financas digitais</h2>
          <p className="mt-2 text-sm text-gray-600">
            Conteudos simples para tomar melhores decisoes antes de usar dinheiro digital.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {financeCards.map((card) => {
            const Icon = card.icon

            return (
              <Card key={card.title} className="rounded-lg border-gray-200 py-5 shadow-sm">
                <CardHeader className="px-5">
                  <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-red-50 text-[#E60000]">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="text-base leading-6 text-gray-900">{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-5">
                  <CardDescription className="leading-6 text-gray-600">{card.text}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white px-4 py-6 shadow-sm sm:px-6">
        <div className="mb-5 flex items-center gap-2">
          <MessageCircle className="size-6 text-[#E60000]" />
          <h2 className="text-2xl font-black text-gray-900">Estou com um problema</h2>
        </div>
        <div className="grid gap-3 lg:grid-cols-[280px_1fr]">
          <div className="flex flex-col gap-2">
            {commonProblems.map((problem) => {
              const isSelected = selectedProblem.title === problem.title

              return (
                <Button
                  key={problem.title}
                  type="button"
                  variant={isSelected ? 'default' : 'outline'}
                  className="h-auto justify-start rounded-lg px-4 py-3 text-left whitespace-normal"
                  onClick={() => setSelectedProblem(problem)}
                >
                  {problem.title}
                </Button>
              )
            })}
          </div>
          <motion.div
            key={selectedProblem.title}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-lg border border-gray-200 bg-gray-50 p-5"
          >
            <h3 className="text-lg font-black text-gray-900">{selectedProblem.title}</h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">{selectedProblem.text}</p>
          </motion.div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-6 shadow-sm sm:px-6">
          <h2 className="text-2xl font-black text-gray-900">Ainda precisa de ajuda?</h2>
          <p className="mt-2 text-sm text-gray-600">
            Envie uma mensagem para a equipa de suporte com os detalhes do problema.
          </p>
          <form className="mt-6 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input className="h-11 rounded-lg" placeholder="Nome" />
              <Input className="h-11 rounded-lg" placeholder="Telefone" type="tel" />
            </div>
            <Input className="h-11 rounded-lg" placeholder="Assunto" />
            <Textarea className="min-h-28 rounded-lg" placeholder="Mensagem" />
            <Button type="button" className="h-11 w-full rounded-lg sm:w-fit">
              <Phone className="size-4" />
              Contactar suporte
            </Button>
          </form>
        </div>

        <div className="rounded-lg bg-gray-900 p-6 text-white">
          <h3 className="text-xl font-black">Centro de Ajuda + Educacao + Suporte</h3>
          <p className="mt-3 text-sm leading-6 text-white/75">
            A ajuda do SmartInfo foi pensada para responder rapido, reduzir deslocacoes e reforcar a literacia financeira dos utilizadores em Mocambique.
          </p>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-green-400" />
              Respostas claras para utilizadores
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-green-400" />
              Orientacao antes de sair de casa
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-green-400" />
              Seguranca no uso do M-Pesa
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
