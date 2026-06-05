import { ApiErrorBody } from '@/lib/types'

export function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback

  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export function getErrorMessage(error: unknown, fallback = 'Erro inesperado.') {
  if (isApiError(error)) return error.response.data.error || fallback
  if (error instanceof Error) return error.message || fallback
  return fallback
}

function isApiError(error: unknown): error is { response: { data: ApiErrorBody } } {
  if (!error || typeof error !== 'object' || !('response' in error)) return false

  const response = (error as { response?: unknown }).response
  if (!response || typeof response !== 'object' || !('data' in response)) return false

  const data = (response as { data?: unknown }).data
  return !!data && typeof data === 'object'
}
