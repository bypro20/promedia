import { getSmmProvider } from './providers'
import { assertSmmApiOk, readSmmApiJson } from './api-response'
import type {
  SmmAction,
  SmmAddResponse,
  SmmBalanceResponse,
  SmmRefillResponse,
  SmmRefillStatusResponse,
  SmmService,
  SmmStatusResponse,
} from './types'

type RequestPayload = Record<string, string | number | undefined>

async function smmRequest<T>(
  action: SmmAction,
  payload: RequestPayload = {},
  providerId = 'default'
): Promise<T> {
  const provider = getSmmProvider(providerId)
  if (!provider) {
    throw new Error('SMM API yapılandırılmadı. SMM_API_URL ve SMM_API_KEY ayarlayın.')
  }

  const body = new URLSearchParams()
  body.set('key', provider.apiKey)
  body.set('action', action)
  for (const [key, value] of Object.entries(payload)) {
    if (value !== undefined && value !== null) {
      body.set(key, String(value))
    }
  }

  const res = await fetch(provider.apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    cache: 'no-store',
  })

  const data = await readSmmApiJson(res)
  assertSmmApiOk(res, data)

  return data as T
}

export async function fetchSmmServices(providerId = 'default'): Promise<SmmService[]> {
  const data = await smmRequest<SmmService[] | { error?: string }>('services', {}, providerId)
  if (!Array.isArray(data)) {
    throw new Error(typeof data === 'object' && data && 'error' in data ? String(data.error) : 'Servis listesi alınamadı')
  }
  return data
}

export async function fetchSmmBalance(providerId = 'default'): Promise<SmmBalanceResponse> {
  return smmRequest<SmmBalanceResponse>('balance', {}, providerId)
}

export async function createSmmOrder(input: {
  serviceId: number
  link: string
  quantity: number
  providerId?: string
}): Promise<SmmAddResponse> {
  return smmRequest<SmmAddResponse>(
    'add',
    {
      service: input.serviceId,
      link: input.link,
      quantity: input.quantity,
    },
    input.providerId
  )
}

export async function fetchSmmOrderStatus(
  smmOrderId: string | number,
  providerId = 'default'
): Promise<SmmStatusResponse> {
  return smmRequest<SmmStatusResponse>('status', { order: smmOrderId }, providerId)
}

export async function requestSmmRefill(
  smmOrderId: string | number,
  providerId = 'default'
): Promise<SmmRefillResponse> {
  return smmRequest<SmmRefillResponse>('refill', { order: smmOrderId }, providerId)
}

export async function fetchSmmRefillStatus(
  refillId: string | number,
  providerId = 'default'
): Promise<SmmRefillStatusResponse> {
  return smmRequest<SmmRefillStatusResponse>('refill_status', { refill: refillId }, providerId)
}

export function normalizeSmmStatus(raw?: string): string {
  if (!raw) return 'processing'
  const s = raw.toLowerCase()
  if (s.includes('complete')) return 'completed'
  if (s.includes('partial')) return 'partial'
  if (s.includes('cancel')) return 'cancelled'
  if (s.includes('progress') || s.includes('processing')) return 'in_progress'
  if (s.includes('pending')) return 'pending'
  if (s.includes('fail')) return 'failed'
  return raw
}
