import { getService } from '@/lib/catalog'
import type { PackageTier } from '@/lib/packages'
import { formatTryPrice } from '@/lib/min-ticket-price'

export function getPackagePrice(slug: string, tierId: PackageTier, amount: number): number | null {
  const service = getService(slug)
  if (!service) return null
  const tier =
    service.tiers.find((t) => t.id === tierId) ??
    service.tiers.find((t) => t.id === service.defaultTier)
  if (!tier) return null
  return tier.packages.find((p) => p.amount === amount)?.price ?? null
}

export function getPackagePriceLabel(slug: string, tierId: PackageTier, amount: number) {
  const price = getPackagePrice(slug, tierId, amount)
  return price != null ? formatTryPrice(price) : '—'
}
