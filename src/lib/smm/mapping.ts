import type { PackageTier } from '@/lib/packages'
import type { SmmService } from './types'
import { fetchSmmBalance, fetchSmmServices } from './client'
import { getSmmProviders, isAutoCheapestEnabled } from './providers'
import { smmCostUsd } from './pricing-engine'
import { getPanelBalanceUsd as getPanelBalanceUsdConverted } from './panel-balance'
import { getMappedEntry, loadMarkupConfig } from './service-map-store'
import { parseServiceSlug, parseSmmRate, scoreSmmServiceName } from './service-match'
import { isWholesaleProvider, WHOLESALE_SCORE_BOOST } from './wholesale'

export type ResolvedSmmService = {
  providerId: string
  providerName: string
  serviceId: number
  serviceName: string
  rate: number
  score: number
}

type MapEntry = Record<string, number | string | { service?: number; provider?: string }>

let cache: { at: number; providers: Array<{ id: string; name: string; services: SmmService[] }> } | null = null

function readExplicitMap(): Record<string, { serviceId: number; providerId?: string }> {
  const map: Record<string, { serviceId: number; providerId?: string }> = {}

  const envMap = process.env.SMM_SERVICE_MAP
  if (envMap) {
    try {
      const parsed = JSON.parse(envMap) as Record<string, number | MapEntry>
      for (const [key, value] of Object.entries(parsed)) {
        if (typeof value === 'number') {
          map[key] = { serviceId: value }
        } else if (value && typeof value === 'object') {
          if ('service' in value || 'provider' in value) {
            map[key] = {
              serviceId: Number((value as { service: number }).service),
              providerId: (value as { provider?: string }).provider,
            }
          } else {
            for (const [tier, id] of Object.entries(value)) {
              map[`${key}:${tier}`] = { serviceId: Number(id) }
            }
          }
        }
      }
    } catch {
      /* ignore */
    }
  }

  const fallback = process.env.SMM_DEFAULT_SERVICE_ID
  if (fallback) {
    map['*'] = { serviceId: Number(fallback) }
  }

  return map
}

async function loadAllProviderServices() {
  const now = Date.now()
  if (cache && now - cache.at < 5 * 60 * 1000) return cache

  const providers = getSmmProviders()
  const results = await Promise.allSettled(
    providers.map(async (p) => ({
      id: p.id,
      name: p.name,
      services: await fetchSmmServices(p.id),
    }))
  )

  const loaded = results
    .filter((r): r is PromiseFulfilledResult<{ id: string; name: string; services: SmmService[] }> => r.status === 'fulfilled')
    .map((r) => r.value)

  if (loaded.length === 0) {
    throw new Error('Hiçbir SMM panelinden servis listesi alınamadı. API anahtarlarını kontrol edin.')
  }

  cache = { at: now, providers: loaded }
  return cache
}

function sortCandidates(candidates: ResolvedSmmService[], useCheapest: boolean) {
  candidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    const maxScore = Math.max(a.score, b.score)
    if (maxScore - Math.min(a.score, b.score) > 5) {
      return b.score - a.score
    }
    if (useCheapest) {
      return a.rate - b.rate
    }
    return b.score - a.score
  })
}

/** Öncelik sırasına göre tüm aday paneller (bakiye kontrolü için) */
export async function resolveSmmServiceCandidates(
  slug: string,
  tierId: PackageTier,
  amount: number
): Promise<ResolvedSmmService[]> {
  const result: ResolvedSmmService[] = []
  const seen = new Set<string>()
  const add = (c: ResolvedSmmService) => {
    const key = `${c.providerId}:${c.serviceId}`
    if (seen.has(key)) return
    seen.add(key)
    result.push(c)
  }

  const dbEntry = await getMappedEntry(slug, tierId)
  if (dbEntry) {
    add({
      providerId: dbEntry.providerId,
      providerName: dbEntry.providerName,
      serviceId: dbEntry.serviceId,
      serviceName: dbEntry.serviceName,
      rate: dbEntry.rate,
      score: dbEntry.score,
    })
  }

  const explicit = readExplicitMap()
  const direct = explicit[`${slug}:${tierId}`] ?? explicit[slug]
  if (direct) {
    const provider = getSmmProviders().find((p) => p.id === direct.providerId) ?? getSmmProviders()[0]
    add({
      providerId: provider?.id ?? 'default',
      providerName: provider?.name ?? 'SMM',
      serviceId: direct.serviceId,
      serviceName: 'Manual map',
      rate: 0,
      score: 999,
    })
  }
  if (explicit['*']) {
    const provider = getSmmProviders()[0]
    add({
      providerId: provider.id,
      providerName: provider.name,
      serviceId: explicit['*'].serviceId,
      serviceName: 'Default map',
      rate: 0,
      score: 999,
    })
  }

  const all = await loadAllProviderServices()
  const markupConfig = await loadMarkupConfig()
  const { platform, serviceKey } = parseServiceSlug(slug)
  const autoCandidates: ResolvedSmmService[] = []

  for (const provider of all.providers) {
    for (const svc of provider.services) {
      const score = scoreSmmServiceName(svc.name, platform, serviceKey, tierId)
      const min = Number(svc.min ?? 0)
      const max = Number(svc.max ?? 999999999)
      if (score < 0 || amount < min || amount > max) continue

      autoCandidates.push({
        providerId: provider.id,
        providerName: provider.name,
        serviceId: svc.service,
        serviceName: svc.name,
        rate: parseSmmRate(svc.rate),
        score:
          score +
          (markupConfig.preferWholesale !== false && isWholesaleProvider(provider.id)
            ? WHOLESALE_SCORE_BOOST
            : 0),
      })
    }
  }

  const useCheapest = markupConfig.autoCheapest ?? isAutoCheapestEnabled()
  sortCandidates(autoCandidates, useCheapest)
  for (const c of autoCandidates) add(c)

  if (result.length === 0) {
    throw new Error(
      `SMM servis eşleşmesi bulunamadı: ${slug} (${tierId}). Admin → SMM Paneller'den "Tüm Servisleri Eşle" çalıştırın.`
    )
  }

  return result
}

export async function resolveSmmService(
  slug: string,
  tierId: PackageTier,
  amount: number
): Promise<ResolvedSmmService> {
  const candidates = await resolveSmmServiceCandidates(slug, tierId, amount)
  return candidates[0]
}

const balanceCache = new Map<string, { at: number; usd: number; currency: string }>()

export async function getPanelBalanceUsd(providerId: string): Promise<{ usd: number; currency: string }> {
  const cached = balanceCache.get(providerId)
  if (cached && Date.now() - cached.at < 30_000) {
    return { usd: cached.usd, currency: cached.currency }
  }
  const markup = await loadMarkupConfig()
  const result = await getPanelBalanceUsdConverted(providerId, markup.usdTry)
  balanceCache.set(providerId, { at: Date.now(), usd: result.usd, currency: result.currency })
  return result
}

/** Yeterli toptan panel bakiyesi olan ilk adayı seçer */
export async function resolveSmmServiceWithBalance(
  slug: string,
  tierId: PackageTier,
  amount: number
): Promise<ResolvedSmmService> {
  const candidates = await resolveSmmServiceCandidates(slug, tierId, amount)
  const tried: string[] = []

  for (const candidate of candidates) {
    const costUsd = smmCostUsd(candidate.rate, amount)
    const { usd: available, currency } = await getPanelBalanceUsd(candidate.providerId)
    tried.push(candidate.providerName)

    if (costUsd <= 0) {
      if (available > 0) return candidate
      continue
    }
    if (available >= costUsd) return candidate

    if (available < costUsd) {
      console.warn(
        `[smm] ${candidate.providerName} bakiye yetersiz: ${available} ${currency} < ${costUsd.toFixed(4)} USD`
      )
    }
  }

  throw new Error(
    `Toptan panel bakiyesi yetersiz (${tried.join(', ')}). BulkFollows / SMMKings / SMMRaja panele USD yükleyin.`
  )
}

/** Panel bakiyesi yeterli mi kontrol et (USD) */
export async function assertPanelBalance(providerId: string, estimatedCostUsd: number) {
  const { usd: available, currency } = await getPanelBalanceUsd(providerId)
  if (available < estimatedCostUsd) {
    throw new Error(
      `SMM panel bakiyesi yetersiz (${available.toFixed(2)} ${currency}, gerekli ~${estimatedCostUsd.toFixed(4)} USD). Toptan panele bakiye yükleyin.`
    )
  }
}

/** @deprecated use resolveSmmService */
export async function resolveSmmServiceId(
  slug: string,
  tierId: PackageTier,
  amount: number,
  providerId = 'default'
): Promise<number> {
  const resolved = await resolveSmmService(slug, tierId, amount)
  if (providerId !== 'default' && resolved.providerId !== providerId) {
    /* keep backward compat */
  }
  return resolved.serviceId
}

export function clearServiceCache() {
  cache = null
  balanceCache.clear()
}

export async function listProviderSummary() {
  const all = await loadAllProviderServices()
  return all.providers.map((p) => ({
    id: p.id,
    name: p.name,
    serviceCount: p.services.length,
  }))
}
