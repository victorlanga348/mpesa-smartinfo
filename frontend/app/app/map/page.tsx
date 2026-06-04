'use client'

import { useState } from 'react'
import { MapComponent } from '@/components/map/map-component'
import { AgentBottomSheet } from '@/components/map/agent-bottom-sheet'
import { SmartSavingsCalculator } from '@/components/calculator/smart-savings-calculator'
import { Agent } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default function MapPage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  return (
    <div className="space-y-5 lg:h-[calc(100vh-112px)] lg:overflow-hidden">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Encontrar agentes</h1>
        <p className="mt-2 text-gray-600">
          Localize agentes M-Pesa proximos de si e confirme disponibilidade antes de sair.
        </p>
      </div>

      <div className="grid gap-5 lg:h-[calc(100%-76px)] lg:grid-cols-[minmax(0,1fr)_390px] lg:items-stretch lg:overflow-hidden">
        <section className="min-h-0 overflow-hidden rounded-lg bg-white shadow-md">
          <div className="h-[58vh] min-h-[430px] lg:h-full lg:min-h-0">
            <MapComponent onAgentSelect={setSelectedAgent} />
          </div>
        </section>

        <aside className="space-y-4 lg:min-h-0 lg:overflow-y-auto lg:pr-1">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              <strong>Dica:</strong> Clique num marcador para ver detalhes do agente.
              Verde = disponivel, amarelo = com cliente, cinzento = offline.
            </p>
          </div>

          <section className="rounded-lg border border-red-100 bg-white p-4 shadow-sm">
            <div className="mb-4">
              <h2 className="text-xl font-black text-gray-900">Teste quanto pode poupar</h2>
              <p className="mt-1 text-sm text-gray-600">
                Compare deslocacao, tempo de espera e pagamento digital antes de sair.
              </p>
            </div>
            <SmartSavingsCalculator embedded />
          </section>
        </aside>
      </div>

      <AgentBottomSheet
        agent={selectedAgent}
        isOpen={!!selectedAgent}
        onClose={() => setSelectedAgent(null)}
      />
    </div>
  )
}
