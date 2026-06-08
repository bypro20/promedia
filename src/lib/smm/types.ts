export type SmmAction =
  | 'services'
  | 'add'
  | 'status'
  | 'balance'
  | 'refill'
  | 'refill_status'
  | 'cancel'

export type SmmProviderConfig = {
  id: string
  name: string
  apiUrl: string
  apiKey: string
}

export type SmmService = {
  service: number
  name: string
  type?: string
  category?: string
  rate?: string
  min?: string
  max?: string
  refill?: boolean
  cancel?: boolean
}

export type SmmAddResponse = {
  order?: number | string
  error?: string
}

export type SmmStatusResponse = {
  charge?: string
  start_count?: string
  status?: string
  remains?: string
  currency?: string
  error?: string
}

export type SmmRefillResponse = {
  refill?: number | string
  error?: string
}

export type SmmRefillStatusResponse = {
  status?: string
  error?: string
}

export type SmmBalanceResponse = {
  balance?: string
  currency?: string
  error?: string
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'in_progress'
  | 'completed'
  | 'partial'
  | 'cancelled'
  | 'failed'
  | 'refunded'
