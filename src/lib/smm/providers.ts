import type { SmmProviderConfig } from './types'
import { getCachedSmmKey } from './key-store'
import type { KeyVisibility } from './panel-key-help'

export type ProviderTier = 'wholesale' | 'reseller'

/** Standart API v2 kullanan bilinen paneller — sadece API key girmeniz yeterli */
export const SMM_PANEL_PRESETS: Array<{
  id: string
  name: string
  apiUrl: string
  envKey: string
  minDeposit?: string
  note?: string
  keyVisibility?: KeyVisibility
  recommended?: boolean
  providerTier?: ProviderTier
}> = [
  {
    id: 'prm4u',
    name: 'PRM4U (Toptan)',
    apiUrl: 'https://prm4u.com/api/v2',
    envKey: 'SMM_KEY_PRM4U',
    minDeposit: '$10',
    note: 'Toptan — 70+ ağ, aracı panel yok, düşük maliyet',
    keyVisibility: 'visible',
    recommended: true,
    providerTier: 'wholesale',
  },
  {
    id: 'sosyaldigital',
    name: 'SosyalDigital',
    apiUrl: 'https://sosyaldigital.com/api/v2',
    envKey: 'SMM_KEY_SOSYALDIGITAL',
    minDeposit: '₺100',
    note: 'TR — geniş katalog, hızlı teslimat',
    providerTier: 'reseller',
  },
  {
    id: 'bayigram',
    name: 'Bayigram',
    apiUrl: 'https://bayigram.com/api/v2',
    envKey: 'SMM_KEY_BAYIGRAM',
    minDeposit: '₺50',
    note: 'TR — uygun fiyat, Instagram/TikTok güçlü',
    providerTier: 'reseller',
  },
  {
    id: 'medyabayim',
    name: 'MedyaBayim',
    apiUrl: 'https://medyabayim.com/api/v2',
    envKey: 'SMM_KEY_MEDYABAYIM',
    minDeposit: '₺50',
    note: 'TR aracı — key yıldızlı',
    keyVisibility: 'always_masked',
    providerTier: 'reseller',
  },
  {
    id: 'turkiyeresellers',
    name: 'TurkiyeResellers',
    apiUrl: 'https://turkiyeresellers.com/api/v2',
    envKey: 'SMM_KEY_TURKIYERESELLERS',
    minDeposit: '₺50',
    note: 'TR aracı — yedek panel, key görünür',
    keyVisibility: 'visible',
    providerTier: 'reseller',
  },
  {
    id: 'smmservisim',
    name: 'SmmServisim',
    apiUrl: 'https://smmservisim.com/api/v2',
    envKey: 'SMM_KEY_SMMSERVISIM',
    minDeposit: '₺50',
    note: 'TR — key yıldızlı, yeni key oluştururken kopyalayın',
    keyVisibility: 'always_masked',
    providerTier: 'reseller',
  },
  {
    id: 'smmevi',
    name: 'SmmEvi',
    apiUrl: 'https://smmevi.net/api/v2',
    envKey: 'SMM_KEY_SMMEVI',
    minDeposit: '₺50',
    note: 'TR — uygun fiyat',
    providerTier: 'reseller',
  },
  {
    id: 'peakerr',
    name: 'Peakerr',
    apiUrl: 'https://peakerr.com/api/v2',
    envKey: 'SMM_KEY_PEAKERR',
    minDeposit: '$5',
    note: 'Global aracı — key yıldızlı',
    keyVisibility: 'always_masked',
    providerTier: 'reseller',
  },
  {
    id: 'jap',
    name: 'JustAnotherPanel',
    apiUrl: 'https://justanotherpanel.com/api/v2',
    envKey: 'SMM_KEY_JAP',
    minDeposit: '$10',
    note: 'Global toptan aggregator — geniş katalog',
    providerTier: 'wholesale',
  },
  {
    id: 'smmfollows',
    name: 'SMMFollows',
    apiUrl: 'https://smmfollows.com/api/v2',
    envKey: 'SMM_KEY_SMMFOLLOWS',
    minDeposit: '$10',
    note: 'Global toptan — reseller dostu',
    providerTier: 'wholesale',
  },
  {
    id: 'worldofsmm',
    name: 'WorldOfSMM',
    apiUrl: 'https://worldofsmm.com/api/v2',
    envKey: 'SMM_KEY_WORLDOFSMM',
    minDeposit: '$5',
    note: 'Global toptan — düşük drop',
    providerTier: 'wholesale',
  },
  {
    id: 'bulkfollows',
    name: 'BulkFollows (Toptan)',
    apiUrl: 'https://bulkfollows.com/api/v2',
    envKey: 'SMM_KEY_BULKFOLLOWS',
    minDeposit: '$10',
    note: 'Toptan — Spotify/SoundCloud güçlü, stabil API',
    keyVisibility: 'visible',
    recommended: true,
    providerTier: 'wholesale',
  },
  {
    id: 'smmkings',
    name: 'SMMKings (Toptan)',
    apiUrl: 'https://smmkings.com/api/v2',
    envKey: 'SMM_KEY_SMMKINGS',
    minDeposit: '$10',
    note: 'Toptan — Instagram/TikTok geniş katalog',
    keyVisibility: 'visible',
    recommended: true,
    providerTier: 'wholesale',
  },
  {
    id: 'smmraja',
    name: 'SMMRaja (Toptan)',
    apiUrl: 'https://smmraja.com/api/v2',
    envKey: 'SMM_KEY_SMMRAJA',
    minDeposit: '$5',
    note: 'Toptan — Telegram ve Asya pazarları',
    keyVisibility: 'visible',
    providerTier: 'wholesale',
  },
  {
    id: 'growfollows',
    name: 'GrowFollows (Toptan)',
    apiUrl: 'https://growfollows.com/api/v2',
    envKey: 'SMM_KEY_GROWFOLLOWS',
    minDeposit: '$5',
    note: 'Toptan — YouTube watch time ucuz',
    keyVisibility: 'visible',
    providerTier: 'wholesale',
  },
  {
    id: 'moresmm',
    name: 'MoreSMM (Toptan)',
    apiUrl: 'https://moresmm.com/api/v2',
    envKey: 'SMM_KEY_MORESMM',
    minDeposit: '$5',
    note: 'Toptan — dengeli fiyat, geniş servis listesi',
    keyVisibility: 'visible',
    providerTier: 'wholesale',
  },
]

function readProvidersJson(): SmmProviderConfig[] {
  const raw = process.env.SMM_PROVIDERS
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw) as SmmProviderConfig[]
    return parsed.filter((p) => p.apiUrl && p.apiKey)
  } catch {
    return []
  }
}

function readPresetProviders(): SmmProviderConfig[] {
  const list: SmmProviderConfig[] = []

  for (const preset of SMM_PANEL_PRESETS) {
    const apiKey = process.env[preset.envKey] || getCachedSmmKey(preset.envKey)
    if (apiKey) {
      list.push({
        id: preset.id,
        name: preset.name,
        apiUrl: preset.apiUrl,
        apiKey,
      })
    }
  }

  return list
}

export function getSmmProviders(): SmmProviderConfig[] {
  const byId = new Map<string, SmmProviderConfig>()

  for (const p of readPresetProviders()) byId.set(p.id, p)
  for (const p of readProvidersJson()) byId.set(p.id, p)

  if (byId.size > 0) {
    const order = SMM_PANEL_PRESETS.map((p) => p.id)
    return [...byId.values()].sort((a, b) => {
      const ia = order.indexOf(a.id)
      const ib = order.indexOf(b.id)
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib)
    })
  }

  const apiUrl = process.env.SMM_API_URL
  const apiKey = process.env.SMM_API_KEY
  if (!apiUrl || !apiKey) return []

  return [
    {
      id: 'default',
      name: process.env.SMM_PROVIDER_NAME ?? 'Primary SMM',
      apiUrl,
      apiKey,
    },
  ]
}

export function getSmmProvider(id = 'default'): SmmProviderConfig | null {
  return getSmmProviders().find((p) => p.id === id) ?? getSmmProviders()[0] ?? null
}

export function isSmmConfigured(): boolean {
  return getSmmProviders().length > 0
}

export function isDemoMode(): boolean {
  if (process.env.SMM_DEMO_MODE === 'true') return true
  return !isSmmConfigured()
}

export function isAutoCheapestEnabled(): boolean {
  return process.env.SMM_AUTO_CHEAPEST !== 'false'
}

export function getConfiguredPanelIds(): string[] {
  return getSmmProviders().map((p) => p.id)
}
