import { ALL_SERVICES } from '@/lib/catalog'
import type { PackageTier } from '@/lib/packages'
import { calcProfitablePrice, smmCostTry } from '@/lib/smm/pricing-engine'
import { fetchSmmServices } from './client'
import type { SmmService } from './types'
import { getSmmProviders } from './providers'
import { parseServiceSlug, parseSmmRate, scoreSmmServiceName } from './service-match'
import type { ServiceMapEntry } from './service-map-store'
import { loadMarkupConfig } from './service-map-store'
import { isWholesaleProvider, WHOLESALE_SCORE_BOOST } from './wholesale'

function isProfitable(sellPrice: number, cost: number, minPct: number) {
  if (sellPrice <= 0 || cost <= 0) return false
  return ((sellPrice - cost) / sellPrice) * 100 >= minPct
}

type ProviderServices = { id: string; name: string; services: SmmService[] }

async function loadProviders(): Promise<ProviderServices[]> {
  const providers = getSmmProviders()
  if (providers.length === 0) throw new Error('API key tanımlı panel yok')

  const results = await Promise.allSettled(
    providers.map(async (p) => ({
      id: p.id,
      name: p.name,
      services: await fetchSmmServices(p.id),
    }))
  )

  const loaded = results
    .filter((r): r is PromiseFulfilledResult<ProviderServices> => r.status === 'fulfilled')
    .map((r) => r.value)

  if (loaded.length === 0) throw new Error('Panel servis listesi alınamadı')
  return loaded
}

function pickBest(
  providers: ProviderServices[],
  slug: string,
  tierId: PackageTier,
  amount: number,
  catalogPrice: number,
  config: Awaited<ReturnType<typeof loadMarkupConfig>>
): ServiceMapEntry | null {
  const { platform, serviceKey } = parseServiceSlug(slug)
  const candidates: ServiceMapEntry[] = []

  for (const provider of providers) {
    const isTrPanel = ['medyabayim', 'turkiyeresellers', 'smmservisim', 'smmevi', 'sosyaldigital', 'bayigram'].includes(provider.id)
    for (const svc of provider.services) {
      const score = scoreSmmServiceName(svc.name, platform, serviceKey, tierId)
      const min = Number(svc.min ?? 0)
      const max = Number(svc.max ?? 999999999)
      if (score < 0 || amount < min || amount > max) continue

      const rate = parseSmmRate(svc.rate)
      let adjScore = score
      if (config.preferWholesale !== false && isWholesaleProvider(provider.id)) adjScore += WHOLESALE_SCORE_BOOST
      if (config.preferTurkish && isTrPanel) adjScore += 3
      if (serviceKey.includes('turk') && isTrPanel) adjScore += 15

      candidates.push({
        providerId: provider.id,
        providerName: provider.name,
        serviceId: svc.service,
        serviceName: svc.name,
        rate,
        score: adjScore,
        auto: true,
        mappedAt: new Date().toISOString(),
      })
    }
  }

  if (candidates.length === 0) return null

  candidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    if (config.autoCheapest) return a.rate - b.rate
    return b.score - a.score
  })

  const topScore = candidates[0].score
  const tierCandidates = candidates.filter((c) => c.score >= topScore - 1)

  const profitable = tierCandidates.filter((c) => {
    const sell = calcProfitablePrice(amount, c.rate, tierId, config, catalogPrice)
    const cost = smmCostTry(c.rate, amount, config.usdTry)
    return isProfitable(sell, cost, config.minProfitPercent)
  })

  const pool = profitable.length > 0 ? profitable : tierCandidates
  pool.sort((a, b) => (config.autoCheapest ? a.rate - b.rate : b.score - a.score))

  return pool[0] ?? null
}

export type AutoMapResult = {
  mapped: number
  unmapped: number
  lowMargin: number
  entries: Record<string, ServiceMapEntry>
  unmappedList: string[]
}

export async function autoMapAllServices(): Promise<AutoMapResult> {
  const config = await loadMarkupConfig()
  const providers = await loadProviders()
  const entries: Record<string, ServiceMapEntry> = {}
  const unmappedList: string[] = []
  let lowMargin = 0

  for (const service of ALL_SERVICES) {
    for (const tier of service.tiers) {
      const key = `${service.slug}:${tier.id}`
      const refPkg = tier.packages.find((p) => p.amount === 1000) ?? tier.packages[Math.floor(tier.packages.length / 2)]
      const picked = pickBest(providers, service.slug, tier.id, refPkg.amount, refPkg.price, config)

      if (!picked) {
        unmappedList.push(key)
        continue
      }

      const sell = calcProfitablePrice(refPkg.amount, picked.rate, tier.id, config, refPkg.price)
      const cost = smmCostTry(picked.rate, refPkg.amount, config.usdTry)
      if (!isProfitable(sell, cost, config.minProfitPercent)) lowMargin++

      entries[key] = picked
    }
  }

  return {
    mapped: Object.keys(entries).length,
    unmapped: unmappedList.length,
    lowMargin,
    entries,
    unmappedList,
  }
}

export function calcProfitStats(sellPrice: number, rate: number, amount: number, usdTry: number) {
  const cost = smmCostTry(rate, amount, usdTry)
  const profit = sellPrice - cost
  const margin = sellPrice > 0 ? (profit / sellPrice) * 100 : 0
  return { cost: Math.round(cost * 100) / 100, profit: Math.round(profit * 100) / 100, margin: Math.round(margin * 10) / 10 }
}
