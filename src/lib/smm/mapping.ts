import type { PackageTier } from '@/lib/packages'
import type { SmmService } from './types'
import { fetchSmmServices } from './client'
import { getSmmProviders, isAutoCheapestEnabled } from './providers'

const TIER_KEYWORDS: Record<PackageTier, string[]> = {
  ucuz: ['ucuz', 'cheap', 'budget', 'economy', 'low'],
  standart: ['standart', 'standard', 'global', 'normal'],
  premium: ['premium', 'high', 'quality'],
  gercek: ['gercek', 'real', 'vip', 'active', 'organic'],
}

const SERVICE_KEYWORDS: Record<string, string[]> = {
  takipci: ['takipci', 'follower', 'followers', 'subscriber', 'abone', 'subscribers'],
  'ucuz-takipci': ['takipci', 'follower', 'followers'],
  'turk-takipci': ['turk', 'turkish', 'türk', 'follower'],
  begeni: ['begeni', 'like', 'likes', 'heart'],
  'ucuz-begeni': ['begeni', 'like', 'likes'],
  'turk-begeni': ['turk', 'turkish', 'begeni', 'like'],
  izlenme: ['izlenme', 'view', 'views', 'watch'],
  'ucuz-izlenme': ['izlenme', 'view', 'views'],
  'reels-izlenme': ['reels', 'view', 'views'],
  'hikaye-izlenme': ['story', 'hikaye', 'view'],
  yorum: ['yorum', 'comment', 'comments'],
  'turk-yorum': ['turk', 'yorum', 'comment'],
  kaydetme: ['kaydet', 'save', 'saves'],
  etkilesim: ['etkilesim', 'engagement', 'impression'],
  abone: ['abone', 'subscriber', 'subscribers'],
  'ucuz-abone': ['abone', 'subscriber'],
  'turk-abone': ['turk', 'abone', 'subscriber'],
  retweet: ['retweet', 'repost'],
  paylasim: ['share', 'paylasim'],
  uye: ['member', 'uye', 'user'],
  dinlenme: ['play', 'stream', 'dinlenme'],
  goruntulenme: ['view', 'goruntulenme'],
  reaksiyon: ['reaction', 'reaksiyon'],
}

const PLATFORM_KEYWORDS: Record<string, string[]> = {
  instagram: ['instagram', 'insta', 'ig'],
  tiktok: ['tiktok', 'tik tok', 'tt'],
  youtube: ['youtube', 'yt'],
  twitter: ['twitter', 'x.com', ' tweet'],
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

function scoreServiceName(name: string, platform: string, serviceKey: string, tierId: PackageTier): number {
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
  if (tierId === 'gercek' && lower.includes('bot')) score -= 8

  return score
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

export async function resolveSmmService(
  slug: string,
  tierId: PackageTier,
  amount: number
): Promise<ResolvedSmmService> {
  const explicit = readExplicitMap()
  const direct = explicit[`${slug}:${tierId}`] ?? explicit[slug]
  if (direct) {
    const provider = getSmmProviders().find((p) => p.id === direct.providerId) ?? getSmmProviders()[0]
    return {
      providerId: provider?.id ?? 'default',
      providerName: provider?.name ?? 'SMM',
      serviceId: direct.serviceId,
      serviceName: 'Manual map',
      rate: 0,
      score: 999,
    }
  }
  if (explicit['*']) {
    const provider = getSmmProviders()[0]
    return {
      providerId: provider.id,
      providerName: provider.name,
      serviceId: explicit['*'].serviceId,
      serviceName: 'Default map',
      rate: 0,
      score: 999,
    }
  }

  const all = await loadAllProviderServices()
  const { platform, serviceKey } = parseSlug(slug)

  const candidates: ResolvedSmmService[] = []

  for (const provider of all.providers) {
    for (const svc of provider.services) {
      const score = scoreServiceName(svc.name, platform, serviceKey, tierId)
      const min = Number(svc.min ?? 0)
      const max = Number(svc.max ?? 999999999)
      if (score <= 0 || amount < min || amount > max) continue

      candidates.push({
        providerId: provider.id,
        providerName: provider.name,
        serviceId: svc.service,
        serviceName: svc.name,
        rate: parseRate(svc.rate),
        score,
      })
    }
  }

  if (candidates.length === 0) {
    throw new Error(
      `SMM servis eşleşmesi bulunamadı: ${slug} (${tierId}). SMM_SERVICE_MAP ile manuel eşleme ekleyin veya daha fazla panel API key tanımlayın.`
    )
  }

  candidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    const maxScore = Math.max(a.score, b.score)
    if (maxScore - Math.min(a.score, b.score) > 5) {
      return b.score - a.score
    }
    if (isAutoCheapestEnabled()) {
      return a.rate - b.rate
    }
    return b.score - a.score
  })

  return candidates[0]
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
}

export async function listProviderSummary() {
  const all = await loadAllProviderServices()
  return all.providers.map((p) => ({
    id: p.id,
    name: p.name,
    serviceCount: p.services.length,
  }))
}
