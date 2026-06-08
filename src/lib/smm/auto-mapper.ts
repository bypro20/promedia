import { ALL_SERVICES } from '@/lib/catalog'
import type { PackageTier } from '@/lib/packages'
import { fetchSmmServices } from './client'
import { getSmmProviders } from './providers'
import type { ServiceMapEntry } from './service-map-store'
import { loadMarkupConfig } from './service-map-store'
import type { SmmService } from './types'

const TIER_KEYWORDS: Record<PackageTier, string[]> = {
  ucuz: ['ucuz', 'cheap', 'budget', 'economy', 'low'],
  standart: ['standart', 'standard', 'global', 'normal'],
  premium: ['premium', 'high', 'quality'],
  gercek: ['gercek', 'real', 'vip', 'active', 'organic'],
}

const SERVICE_KEYWORDS: Record<string, string[]> = {
  takipci: ['takipci', 'follower', 'followers', 'subscriber', 'abone'],
  'ucuz-takipci': ['follower', 'followers'],
  'turk-takipci': ['turk', 'turkish', 'türk', 'follower'],
  begeni: ['begeni', 'like', 'likes', 'heart'],
  'ucuz-begeni': ['begeni', 'like', 'likes'],
  'turk-begeni': ['turk', 'begeni', 'like'],
  izlenme: ['izlenme', 'view', 'views', 'watch'],
  'ucuz-izlenme': ['view', 'views'],
  'reels-izlenme': ['reels', 'view'],
  'hikaye-izlenme': ['story', 'hikaye', 'view'],
  yorum: ['yorum', 'comment', 'comments'],
  'turk-yorum': ['turk', 'yorum', 'comment'],
  kaydetme: ['save', 'kaydet'],
  etkilesim: ['engagement', 'etkilesim'],
  abone: ['subscriber', 'abone'],
  'ucuz-abone': ['subscriber', 'abone'],
  'turk-abone': ['turk', 'abone', 'subscriber'],
  retweet: ['retweet', 'repost'],
  paylasim: ['share', 'paylasim'],
  uye: ['member', 'uye'],
  dinlenme: ['play', 'stream', 'dinlenme'],
  goruntulenme: ['view', 'goruntulenme'],
  reaksiyon: ['reaction', 'reaksiyon'],
}

const PLATFORM_KEYWORDS: Record<string, string[]> = {
  instagram: ['instagram', 'insta', 'ig'],
  tiktok: ['tiktok', 'tt'],
  youtube: ['youtube', 'yt'],
  twitter: ['twitter', 'x.com', 'tweet'],
  facebook: ['facebook', 'fb'],
  telegram: ['telegram', 'tg'],
  spotify: ['spotify'],
  linkedin: ['linkedin'],
  pinterest: ['pinterest'],
  twitch: ['twitch'],
  discord: ['discord'],
  threads: ['threads'],
  kick: ['kick'],
  soundcloud: ['soundcloud'],
}

function parseSlug(slug: string) {
  const match = slug.match(/^(.+)-(.+)-satin-al$/)
  if (!match) return { platform: '', serviceKey: slug }
  return { platform: match[1], serviceKey: match[2] }
}

function parseRate(rate?: string): number {
  if (!rate) return Number.POSITIVE_INFINITY
  const n = parseFloat(rate.replace(',', '.'))
  return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY
}

function scoreName(name: string, platform: string, serviceKey: string, tierId: PackageTier): number {
  const lower = name.toLowerCase()
  let score = 0
  for (const kw of PLATFORM_KEYWORDS[platform] ?? [platform]) {
    if (lower.includes(kw)) score += 10
  }
  for (const kw of SERVICE_KEYWORDS[serviceKey] ?? [serviceKey.replace(/-/g, ' ')]) {
    if (lower.includes(kw)) score += 8
  }
  for (const kw of TIER_KEYWORDS[tierId]) {
    if (lower.includes(kw)) score += 5
  }
  if (tierId === 'ucuz' && (lower.includes('turk') || lower.includes('türk'))) score -= 6
  if (serviceKey.includes('turk') && (lower.includes('turk') || lower.includes('türk'))) score += 6
  if (tierId === 'gercek' && lower.includes('bot')) score -= 8
  return score
}

function smmCostTry(rate: number, amount: number, usdTry: number) {
  return (amount / 1000) * rate * usdTry
}

function isProfitable(sellPrice: number, cost: number, minPct: number) {
  if (sellPrice <= 0) return false
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
  sellPrice: number,
  config: Awaited<ReturnType<typeof loadMarkupConfig>>
): ServiceMapEntry | null {
  const { platform, serviceKey } = parseSlug(slug)
  const candidates: ServiceMapEntry[] = []

  for (const provider of providers) {
    const isTrPanel = ['medyabayim', 'turkiyeresellers', 'smmservisim', 'smmevi', 'sosyaldigital', 'bayigram'].includes(provider.id)
    for (const svc of provider.services) {
      const score = scoreName(svc.name, platform, serviceKey, tierId)
      const min = Number(svc.min ?? 0)
      const max = Number(svc.max ?? 999999999)
      if (score <= 0 || amount < min || amount > max) continue

      const rate = parseRate(svc.rate)
      let adjScore = score
      if (config.preferTurkish && isTrPanel) adjScore += 3
      if (serviceKey.includes('turk') && isTrPanel) adjScore += 4

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

  const profitable = candidates.filter((c) =>
    isProfitable(sellPrice, smmCostTry(c.rate, amount, config.usdTry), config.minProfitPercent)
  )

  const pool = profitable.length > 0 ? profitable : candidates

  pool.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    if (config.autoCheapest) return a.rate - b.rate
    return b.score - a.score
  })

  return pool[0]
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

      const cost = smmCostTry(picked.rate, refPkg.amount, config.usdTry)
      if (!isProfitable(refPkg.price, cost, config.minProfitPercent)) lowMargin++

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
