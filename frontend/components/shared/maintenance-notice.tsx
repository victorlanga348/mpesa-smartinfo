'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, CheckCircle2, Clock3, Info, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  formatMaintenanceDate,
  maintenanceInfo,
  shouldShowMaintenanceNotice,
  type MaintenanceInfo,
} from '@/lib/maintenance'

export function MaintenanceNotice() {
  const [dismissed, setDismissed] = useState(false)
  const [open, setOpen] = useState(false)
  const info = maintenanceInfo

  const details = useMemo(() => getMaintenanceDetails(info), [info])

  if (dismissed || !shouldShowMaintenanceNotice(info)) {
    return null
  }

  const Icon = info.state === 'completed' ? CheckCircle2 : info.state === 'scheduled' ? Clock3 : AlertTriangle
  const tone = getTone(info.state)

  return (
    <>
      <section
        aria-label={info.title}
        className="fixed right-2 top-20 z-[70] max-w-[calc(100vw-1rem)] sm:right-4 sm:top-4 sm:max-w-sm"
      >
        <div
          className={`flex min-h-11 items-center gap-2 rounded-lg border bg-white px-2.5 py-2 text-sm shadow-lg shadow-black/10 backdrop-blur sm:px-3 ${tone.border}`}
        >
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex min-w-0 items-center gap-2 text-left"
            aria-haspopup="dialog"
          >
            <span className={`grid size-7 shrink-0 place-items-center rounded-md ${tone.iconBg}`}>
              <Icon className={`size-4 ${tone.icon}`} aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-bold text-gray-900">{info.title}</span>
              {details.primary && (
                <span className="block truncate text-xs text-gray-600">{details.primary}</span>
              )}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="grid size-7 shrink-0 place-items-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            aria-label="Fechar aviso de manutencao"
          >
            <X className="size-4" />
          </button>
        </div>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[calc(100vw-1rem)] gap-3 p-4 sm:max-w-md sm:p-5">
          <DialogHeader>
            <div className="mb-1 flex items-center gap-2 pr-7">
              <span className={`grid size-8 shrink-0 place-items-center rounded-md ${tone.iconBg}`}>
                <Icon className={`size-4 ${tone.icon}`} aria-hidden="true" />
              </span>
              <DialogTitle className="text-left text-base leading-6 text-gray-900">
                {info.title}
              </DialogTitle>
            </div>
            <DialogDescription className="text-left leading-6 text-gray-600">
              {info.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 text-sm text-gray-700">
            {details.scheduledAt && <DetailRow icon={Clock3} label="Data" value={details.scheduledAt} />}
            {details.estimatedEndAt && <DetailRow icon={Clock3} label="Previsao" value={details.estimatedEndAt} />}
            {info.impact && <DetailRow icon={Info} label="Impacto" value={info.impact} />}
          </div>

          {info.primaryActionHref && info.primaryActionLabel && (
            <Button asChild className="mt-1 h-10 w-full rounded-lg bg-[#E60000] text-white hover:bg-red-700">
              <Link href={info.primaryActionHref}>{info.primaryActionLabel}</Link>
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock3
  label: string
  value: string
}) {
  return (
    <div className="flex gap-2 rounded-lg bg-gray-50 p-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-gray-500" aria-hidden="true" />
      <p>
        <span className="font-semibold text-gray-900">{label}: </span>
        <span>{value}</span>
      </p>
    </div>
  )
}

function getMaintenanceDetails(info: MaintenanceInfo) {
  const scheduledAt = formatMaintenanceDate(info.scheduledAt)
  const estimatedEndAt = formatMaintenanceDate(info.estimatedEndAt)

  return {
    scheduledAt,
    estimatedEndAt,
    primary: info.state === 'scheduled'
      ? scheduledAt
      : info.state === 'active'
        ? estimatedEndAt ? `Previsao: ${estimatedEndAt}` : info.impact
        : undefined,
  }
}

function getTone(state: MaintenanceInfo['state']) {
  if (state === 'completed') {
    return {
      border: 'border-green-200',
      icon: 'text-green-700',
      iconBg: 'bg-green-50',
    }
  }

  if (state === 'scheduled') {
    return {
      border: 'border-amber-200',
      icon: 'text-amber-700',
      iconBg: 'bg-amber-50',
    }
  }

  return {
    border: 'border-red-200',
    icon: 'text-[#E60000]',
    iconBg: 'bg-red-50',
  }
}
