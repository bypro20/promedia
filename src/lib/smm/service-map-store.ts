import { prisma } from '@/lib/db'
import type { PackageTier } from '@/lib/packages'

export type ServiceMapEntry = {
  providerId: string
  providerName: string
  serviceId: number
  serviceName: string
  rate: number
  score: number
  auto: boolean
  mappedAt: string
}

export type MarkupConfig = {
  enabled: boolean
  usdTry: number
  autoCheapest: boolean
  preferTurkish: boolean
  minProfitPercent: number
  tierMultipliers: Record<PackageTier, number>
}

const MAP_KEY = 'smm_service_map'
const MARKUP_KEY = 'smm_markup_config'

export const DEFAULT_MARKUP: MarkupConfig = {
  enabled: true,
  usdTry: Number(process.env.SMM_USD_TRY ?? 35),
  autoCheapest: true,
  preferTurkish: true,
  minProfitPercent: 35,
  tierMultipliers: {
    ucuz: 3.2,
    standart: 2.6,
    premium: 2.1,
    gercek: 1.85,
  },
}

let mapCache: Record<string, ServiceMapEntry> | null = null
let markupCache: MarkupConfig | null = null
let loadedAt = 0

function mapKey(slug: string, tierId: PackageTier) {
  return `${slug}:${tierId}`
}

export async function loadServiceMap(): Promise<Record<string, ServiceMapEntry>> {
  if (mapCache && Date.now() - loadedAt < 30_000) return mapCache
  const row = await prisma.siteSetting.findUnique({ where: { key: MAP_KEY } })
  mapCache = row ? (JSON.parse(row.value) as Record<string, ServiceMapEntry>) : {}
  loadedAt = Date.now()
  return mapCache
}

export async function saveServiceMap(map: Record<string, ServiceMapEntry>) {
  await prisma.siteSetting.upsert({
    where: { key: MAP_KEY },
    create: { key: MAP_KEY, value: JSON.stringify(map) },
    update: { value: JSON.stringify(map) },
  })
  mapCache = map
  loadedAt = Date.now()
}

export async function getMappedEntry(slug: string, tierId: PackageTier): Promise<ServiceMapEntry | null> {
  const map = await loadServiceMap()
  return map[mapKey(slug, tierId)] ?? null
}

export async function setMappedEntry(slug: string, tierId: PackageTier, entry: ServiceMapEntry) {
  const map = await loadServiceMap()
  map[mapKey(slug, tierId)] = entry
  await saveServiceMap(map)
}

export async function loadMarkupConfig(): Promise<MarkupConfig> {
  if (markupCache && Date.now() - loadedAt < 30_000) return markupCache
  const row = await prisma.siteSetting.findUnique({ where: { key: MARKUP_KEY } })
  const config: MarkupConfig = row ? { ...DEFAULT_MARKUP, ...JSON.parse(row.value) } : { ...DEFAULT_MARKUP }
  markupCache = config
  return config
}

export async function saveMarkupConfig(config: MarkupConfig) {
  await prisma.siteSetting.upsert({
    where: { key: MARKUP_KEY },
    create: { key: MARKUP_KEY, value: JSON.stringify(config) },
    update: { value: JSON.stringify(config) },
  })
  markupCache = config
}

export function clearMapCache() {
  mapCache = null
  markupCache = null
  loadedAt = 0
}
