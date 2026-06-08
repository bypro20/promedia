import { prisma } from '@/lib/db'
import { SMM_PANEL_PRESETS } from './providers'

const PREFIX = 'smm_key_'

/** Bellek önbelleği — env + DB birleşimi için */
const cache = new Map<string, string>()
let loadedAt = 0

export async function refreshSmmKeyCache() {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { startsWith: PREFIX } },
  })
  cache.clear()
  for (const row of rows) {
    if (row.value.trim()) cache.set(row.key, row.value.trim())
  }
  loadedAt = Date.now()
}

export async function ensureSmmKeyCache(maxAgeMs = 60_000) {
  if (Date.now() - loadedAt > maxAgeMs) await refreshSmmKeyCache()
}

export function getCachedSmmKey(envKey: string): string | undefined {
  const dbKey = `${PREFIX}${envKey.toLowerCase()}`
  return cache.get(dbKey)
}

export async function saveSmmKey(envKey: string, apiKey: string) {
  const dbKey = `${PREFIX}${envKey.toLowerCase()}`
  const value = apiKey.trim()
  if (!value) {
    await prisma.siteSetting.deleteMany({ where: { key: dbKey } })
    cache.delete(dbKey)
    return
  }
  await prisma.siteSetting.upsert({
    where: { key: dbKey },
    create: { key: dbKey, value },
    update: { value },
  })
  cache.set(dbKey, value)
  loadedAt = Date.now()
}

export async function listSavedSmmKeys(): Promise<Record<string, boolean>> {
  await ensureSmmKeyCache()
  const out: Record<string, boolean> = {}
  for (const preset of SMM_PANEL_PRESETS) {
    out[preset.envKey] = Boolean(getCachedSmmKey(preset.envKey))
  }
  return out
}
