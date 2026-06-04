'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapComponent } from '@/components/map/map-component'
import { AgentBottomSheet } from '@/components/map/agent-bottom-sheet'
import { SmartSavingsCalculator } from '@/components/calculator/smart-savings-calculator'
import { Agent } from '@/lib/types'
import { authService } from '@/lib/services/auth'

export const dynamic = 'force-dynamic'

export default function MapPage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const router = useRouter()
  const user = authService.getCurrentUser()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Encontrar Agentes</h1>
        <p className="text-gray-600 mt-2">
          Localize agentes M-Pesa próximos de si com saldo disponível
        </p>
      </div>

      {/* Map */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <MapComponent onAgentSelect={setSelectedAgent} />
      </div>

      {/* Agent Bottom Sheet */}
      <AgentBottomSheet
        agent={selectedAgent}
        isOpen={!!selectedAgent}
        onClose={() => setSelectedAgent(null)}
      />

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Dica:</strong> Clique em qualquer marcador para ver detalhes do agente. 
          Verde = Online, Amarelo = Ocupado, Cinzento = Offline
        </p>
      </div>

      <section className="rounded-lg border border-red-100 bg-white p-4 shadow-sm">
        <div className="mb-4">
          <h2 className="text-xl font-black text-gray-900">Teste quanto pode poupar</h2>
          <p className="mt-1 text-sm text-gray-600">
            Compare levantar dinheiro com pagar digitalmente antes de sair.
          </p>
        </div>
        <SmartSavingsCalculator embedded />
      </section>
    </div>
  )
}
