import { getService } from '@/lib/catalog'
import type { PackageTier, ServiceDefinition } from '@/lib/packages'
import { loadMarkupConfig, loadServiceMap } from '@/lib/smm/service-map-store'
import { calcProfitablePrice, smmCostTry } from '@/lib/smm/pricing-engine'

/** Katalog servisini SMM maliyetine göre karlı fiyatlarla döndürür */
export async function getPricedService(slug: string): Promise<ServiceDefinition | null> {
  const service = getService(slug)
  if (!service) return null

  const [map, markup] = await Promise.all([loadServiceMap(), loadMarkupConfig()])
  if (!markup.enabled || Object.keys(map).length === 0) return service

  const tiers = service.tiers.map((tier) => ({
    ...tier,
    packages: tier.packages.map((pkg) => {
      const entry = map[`${service.slug}:${tier.id}`]
      if (!entry) return pkg
      const price = calcProfitablePrice(pkg.amount, entry.rate, tier.id as PackageTier, markup, pkg.price)
      return { ...pkg, price }
    }),
  }))

  return { ...service, tiers }
}

export type ProfitSummary = {
  mappedTiers: number
  totalTiers: number
  avgMargin: number
  profitMode: boolean
}

export async function getProfitSummary(): Promise<ProfitSummary> {
  const { ALL_SERVICES } = await import('@/lib/catalog')
  const [map, markup] = await Promise.all([loadServiceMap(), loadMarkupConfig()])

  let totalTiers = 0
  let mappedTiers = 0
  let marginSum = 0
  let marginCount = 0

  for (const s of ALL_SERVICES) {
    for (const tier of s.tiers) {
      totalTiers++
      const entry = map[`${s.slug}:${tier.id}`]
      if (!entry) continue
      mappedTiers++
      const ref = tier.packages.find((p) => p.amount === 1000) ?? tier.packages[0]
      const cost = smmCostTry(entry.rate, ref.amount, markup.usdTry)
      const price = calcProfitablePrice(ref.amount, entry.rate, tier.id, markup, ref.price)
      if (price > 0 && cost > 0) {
        marginSum += ((price - cost) / price) * 100
        marginCount++
      }
    }
  }

  return {
    mappedTiers,
    totalTiers,
    avgMargin: marginCount ? Math.round((marginSum / marginCount) * 10) / 10 : 0,
    profitMode: mappedTiers > 0 && markup.enabled,
  }
}
