'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const statusBadgeVariants = cva('inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium', {
  variants: {
    status: {
      online: 'bg-green-100 text-green-800',
      offline: 'bg-gray-100 text-gray-800',
      busy: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-blue-100 text-blue-800',
      accepted: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-blue-100 text-blue-800',
      waiting_list: 'bg-purple-100 text-purple-800',
      arrived: 'bg-green-100 text-green-800',
      in_service: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-red-100 text-red-800',
    },
  },
  defaultVariants: {
    status: 'pending',
  },
})

export interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  showDot?: boolean
  className?: string
}

export function StatusBadge({ status, showDot = true, className }: StatusBadgeProps) {
  const dotColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    busy: 'bg-yellow-500',
    pending: 'bg-blue-500',
    accepted: 'bg-blue-500',
    confirmed: 'bg-blue-500',
    waiting_list: 'bg-purple-500',
    arrived: 'bg-green-500',
    in_service: 'bg-yellow-500',
    completed: 'bg-green-500',
    rejected: 'bg-red-500',
    cancelled: 'bg-red-500',
  }

  const statusLabels = {
    online: 'Online',
    offline: 'Offline',
    busy: 'Ocupado',
    pending: 'Pendente',
    accepted: 'Aceite',
    confirmed: 'Confirmado',
    waiting_list: 'Lista de espera',
    arrived: 'Chegou',
    in_service: 'Em atendimento',
    completed: 'Completado',
    rejected: 'Rejeitado',
    cancelled: 'Cancelado',
  }

  return (
    <span className={cn(statusBadgeVariants({ status }), className)}>
      {showDot && <span className={cn('w-2 h-2 rounded-full', dotColors[status!])} />}
      {statusLabels[status!]}
    </span>
  )
}
