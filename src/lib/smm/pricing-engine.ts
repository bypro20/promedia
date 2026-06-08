import type { PackageTier } from '@/lib/packages'
import type { MarkupConfig } from './service-map-store'
import { DEFAULT_MARKUP, getMappedEntry, loadMarkupConfig } from './service-map-store'

export function smmCostTry(rate: number, amount: number, usdTry: number) {
  if (!Number.isFinite(rate) || rate <= 0) return 0
  return (amount / 1000) * rate * usdTry
}

function minTicketPrice(amount: number) {
  if (amount <= 50) return 9.9
  if (amount <= 100) return 14.9
  if (amount <= 250) return 24.9
  return 39.9
}

/** SMM maliyetine göre karlı satış fiyatı hesapla */
export function calcProfitablePrice(
  amount: number,
  rate: number,
  tierId: PackageTier,
  markup: MarkupConfig,
  catalogPrice?: number
): number {
  const cost = smmCostTry(rate, amount, markup.usdTry)
  if (cost <= 0) return catalogPrice ?? minTicketPrice(amount)

  const mult = markup.tierMultipliers[tierId] ?? 2.5
  const fromMultiplier = cost * mult
  const fromMinMargin = cost / (1 - markup.minProfitPercent / 100)
  let price = Math.max(fromMultiplier, fromMinMargin, minTicketPrice(amount))

  // Katalog fiyatının altına düşme — marka değerini koru
  if (catalogPrice && catalogPrice > price) {
    price = catalogPrice
  }

  return Math.round(price * 100) / 100
}

export function profitMarginPercent(sellPrice: number, cost: number) {
  if (sellPrice <= 0) return 0
  return Math.round(((sellPrice - cost) / sellPrice) * 1000) / 10
}

export async function resolveSellPrice(
  serviceSlug: string,
  tierId: PackageTier,
  amount: number,
  catalogPrice: number
): Promise<{ price: number; dynamic: boolean; cost: number; margin: number }> {
  const markup = await loadMarkupConfig()
  if (!markup.enabled) {
    return { price: catalogPrice, dynamic: false, cost: 0, margin: 0 }
  }

  const entry = await getMappedEntry(serviceSlug, tierId)
  if (!entry || entry.rate <= 0) {
    return { price: catalogPrice, dynamic: false, cost: 0, margin: 0 }
  }

  const cost = smmCostTry(entry.rate, amount, markup.usdTry)
  const price = calcProfitablePrice(amount, entry.rate, tierId, markup, catalogPrice)
  return {
    price,
    dynamic: price !== catalogPrice,
    cost: Math.round(cost * 100) / 100,
    margin: profitMarginPercent(price, cost),
  }
}

export async function isProfitModeActive() {
  const markup = await loadMarkupConfig()
  if (!markup.enabled) return false
  const entry = await getMappedEntry('instagram-takipci-satin-al', 'standart')
  return Boolean(entry)
}

export { DEFAULT_MARKUP }
