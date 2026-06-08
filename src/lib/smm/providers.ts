import type { SmmProviderConfig } from './types'

/** Standart API v2 kullanan bilinen paneller — sadece API key girmeniz yeterli */
export const SMM_PANEL_PRESETS: Array<{
  id: string
  name: string
  apiUrl: string
  envKey: string
  minDeposit?: string
  note?: string
}> = [
  {
    id: 'medyabayim',
    name: 'MedyaBayim',
    apiUrl: 'https://medyabayim.com/api/v2',
    envKey: 'SMM_KEY_MEDYABAYIM',
    minDeposit: '₺50',
    note: 'TR — uzun süredir aktif, geniş servis listesi',
  },
  {
    id: 'turkiyeresellers',
    name: 'TurkiyeResellers',
    apiUrl: 'https://turkiyeresellers.com/api/v2',
    envKey: 'SMM_KEY_TURKIYERESELLERS',
    minDeposit: '₺50',
    note: 'TR — API v3/v2, otomatik refill',
  },
  {
    id: 'smmservisim',
    name: 'SmmServisim',
    apiUrl: 'https://smmservisim.com/api/v2',
    envKey: 'SMM_KEY_SMMSERVISIM',
    minDeposit: '₺50',
    note: 'TR — çoklu provider routing',
  },
  {
    id: 'smmevi',
    name: 'SmmEvi',
    apiUrl: 'https://smmevi.net/api/v2',
    envKey: 'SMM_KEY_SMMEVI',
    minDeposit: '₺50',
    note: 'TR — uygun fiyat',
  },
  {
    id: 'peakerr',
    name: 'Peakerr',
    apiUrl: 'https://peakerr.com/api/v2',
    envKey: 'SMM_KEY_PEAKERR',
    minDeposit: '$5',
    note: 'Global — sık en ucuz seçenek',
  },
  {
    id: 'jap',
    name: 'JustAnotherPanel',
    apiUrl: 'https://justanotherpanel.com/api/v2',
    envKey: 'SMM_KEY_JAP',
    minDeposit: '$10',
    note: 'Global — stabil, geniş katalog',
  },
  {
    id: 'smmfollows',
    name: 'SMMFollows',
    apiUrl: 'https://smmfollows.com/api/v2',
    envKey: 'SMM_KEY_SMMFOLLOWS',
    minDeposit: '$10',
    note: 'Global — reseller dostu',
  },
  {
    id: 'worldofsmm',
    name: 'WorldOfSMM',
    apiUrl: 'https://worldofsmm.com/api/v2',
    envKey: 'SMM_KEY_WORLDOFSMM',
    minDeposit: '$5',
    note: 'Global — düşük drop oranı',
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
    const apiKey = process.env[preset.envKey]
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
  const fromJson = readProvidersJson()
  if (fromJson.length > 0) return fromJson

  const fromPresets = readPresetProviders()
  if (fromPresets.length > 0) return fromPresets

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
