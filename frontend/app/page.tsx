import { Navbar } from '@/components/shared/navbar'
import { HeroSection } from '@/components/sections/hero'
import { Button } from '@/components/ui/button'
import { CheckCircle, MapPin, MessageCircle, ShieldCheck, Wallet } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />

      <section id="como-usar" className="bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 max-w-2xl">
            <p className="mb-2 text-sm font-black uppercase tracking-wide text-primary">Como usar</p>
            <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">Poucos passos. Sem complicacao.</h2>
            <p className="mt-3 text-base leading-relaxed text-gray-600">
              A pessoa so precisa dizer onde esta, escolher um agente e confirmar quando chegar.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: MapPin,
                title: 'Veja onde esta',
                text: 'O mapa pede a sua localizacao e mostra agentes perto de si.',
              },
              {
                icon: MessageCircle,
                title: 'Peça ao agente',
                text: 'Escolha o tempo que o agente deve esperar e envie o pedido.',
              },
              {
                icon: CheckCircle,
                title: 'Confirme a chegada',
                text: 'Quando chegar ao local, toque em Cheguei para sair da fila.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-red-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-red-50 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="poupanca" className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div>
            <p className="mb-2 text-sm font-black uppercase tracking-wide text-primary">Calculadora de poupanca</p>
            <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">Veja se vale a pena levantar dinheiro.</h2>
            <p className="mt-3 text-base leading-relaxed text-gray-600">
              A ferramenta ajuda a comparar deslocação, tempo de espera e alternativa digital antes de sair.
            </p>
            <Button asChild className="mt-6 h-12 rounded-full bg-primary px-7 font-black text-white hover:bg-red-700">
              <Link href="/app/map">Testar no mapa</Link>
            </Button>
          </div>

          <div className="rounded-lg border border-red-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-red-600 text-white">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">Quanto pode poupar hoje?</h3>
                <p className="text-sm text-gray-600">A análise aparece depois de informar distância e tentativa de atendimento.</p>
              </div>
            </div>
            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-between rounded-lg bg-red-50 p-3">
                <span className="font-bold text-gray-700">Levantar dinheiro</span>
                <span className="font-black text-primary">Depende da rota</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
                <span className="font-bold text-gray-700">Pagar digitalmente</span>
                <span className="font-black text-green-700">Comparar antes</span>
              </div>
              <div className="rounded-lg bg-green-600 p-4 text-white">
                <p className="text-sm font-bold text-white/85">Resultado</p>
                <p className="text-lg font-black">Os dados aparecem quando fizer a simulação.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="agentes" className="bg-red-600 px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="mb-2 text-sm font-black uppercase tracking-wide text-white/80">Para agentes M-Pesa</p>
            <h2 className="text-3xl font-black sm:text-4xl">Receba pedidos e organize a sua fila.</h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/85">
              O agente ve o nome, numero, valor e tempo de espera escolhido pelo cliente. Depois aceita ou rejeita o pedido.
            </p>
          </div>
          <Button asChild className="h-12 rounded-full bg-white px-7 font-black text-primary hover:bg-red-50">
            <Link href="/login">Entrar como agente</Link>
          </Button>
        </div>
      </section>

      <section id="ajuda" className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-center">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-green-50 text-green-700">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">Feito para ser facil.</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Nao precisa criar conta antes. Se for cliente novo, basta colocar nome e numero.
              </p>
            </div>
            <Button asChild className="h-12 rounded-full bg-primary px-7 font-black text-white hover:bg-red-700">
              <Link href="/app/help">Abrir ajuda</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 bg-white px-4 py-8 text-sm text-gray-600 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-black text-gray-900">m-pesa smartinfo</div>
          <div className="flex gap-4">
            <Link href="/app/map" className="hover:text-primary">Mapa</Link>
            <Link href="/login" className="hover:text-primary">Agente/Admin</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
