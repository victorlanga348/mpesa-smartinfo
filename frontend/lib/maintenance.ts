export type MaintenanceState = 'operational' | 'scheduled' | 'active' | 'completed'

export type MaintenanceInfo = {
  state: MaintenanceState
  title: string
  description: string
  scheduledAt?: string
  estimatedEndAt?: string
  impact?: string
  primaryActionHref?: string
  primaryActionLabel?: string
}

const state = normalizeState(process.env.NEXT_PUBLIC_MAINTENANCE_STATE)

export const maintenanceInfo: MaintenanceInfo = {
  state,
  title: getTitle(state),
  description: getDescription(state),
  scheduledAt: process.env.NEXT_PUBLIC_MAINTENANCE_SCHEDULED_AT,
  estimatedEndAt: process.env.NEXT_PUBLIC_MAINTENANCE_ESTIMATED_END_AT,
  impact: process.env.NEXT_PUBLIC_MAINTENANCE_IMPACT,
  primaryActionHref: process.env.NEXT_PUBLIC_MAINTENANCE_ACTION_HREF,
  primaryActionLabel: process.env.NEXT_PUBLIC_MAINTENANCE_ACTION_LABEL,
}

export function shouldShowMaintenanceNotice(info: MaintenanceInfo) {
  return info.state === 'scheduled' || info.state === 'active' || info.state === 'completed'
}

export function formatMaintenanceDate(value?: string) {
  if (!value) return undefined

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('pt-MZ', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function normalizeState(value?: string): MaintenanceState {
  const normalized = value?.trim().toLowerCase()

  if (normalized === 'scheduled' || normalized === 'active' || normalized === 'completed') {
    return normalized
  }

  return 'operational'
}

function getTitle(currentState: MaintenanceState) {
  if (currentState === 'scheduled') return 'Manutencao agendada'
  if (currentState === 'active') return 'Manutencao em andamento'
  if (currentState === 'completed') return 'Manutencao concluida'

  return 'Sistema operacional'
}

function getDescription(currentState: MaintenanceState) {
  if (currentState === 'scheduled') return 'Alguns servicos podem ficar limitados no periodo indicado.'
  if (currentState === 'active') return 'Estamos a fazer ajustes. A app continua disponivel.'
  if (currentState === 'completed') return 'Os servicos voltaram ao funcionamento normal.'

  return 'Os servicos principais estao disponiveis.'
}
