import { fetchSmmBalance } from './client'

export type PanelBalanceInfo = {
  raw: number
  currency: string
}

export async function fetchPanelBalance(providerId: string): Promise<PanelBalanceInfo> {
  const bal = await fetchSmmBalance(providerId)
  const raw = parseFloat(bal.balance ?? '0')
  return {
    raw: Number.isFinite(raw) ? raw : 0,
    currency: (bal.currency ?? 'USD').toUpperCase(),
  }
}

/** Panel API rate = para birimi / 1000 birim */
export function smmCostNative(rate: number, amount: number): number {
  if (!Number.isFinite(rate) || rate <= 0) return 0
  return (amount / 1000) * rate
}

export function panelCanAffordOrder(balance: PanelBalanceInfo, rate: number, amount: number): boolean {
  const cost = smmCostNative(rate, amount)
  if (cost <= 0) return balance.raw > 0
  return balance.raw >= cost
}

/** USD karşılaştırması (raporlama) */
export async function getPanelBalanceUsd(providerId: string, usdTry = 35): Promise<{ usd: number; currency: string }> {
  const bal = await fetchPanelBalance(providerId)
  if (bal.currency === 'TRY') {
    return { usd: bal.raw / usdTry, currency: bal.currency }
  }
  return { usd: bal.raw, currency: bal.currency }
}
