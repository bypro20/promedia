import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth'
import { ALL_SERVICES } from '@/lib/catalog'
import type { PackageTier } from '@/lib/packages'
import { autoMapAllServices, calcProfitStats } from '@/lib/smm/auto-mapper'
import { fetchSmmBalance, fetchSmmServices } from '@/lib/smm/client'
import { ensureSmmKeyCache, listSavedSmmKeys, refreshSmmKeyCache, saveSmmKey } from '@/lib/smm/key-store'
import { clearServiceCache, listProviderSummary } from '@/lib/smm/mapping'
import {
  clearMapCache,
  loadMarkupConfig,
  loadServiceMap,
  saveMarkupConfig,
  saveServiceMap,
  setMappedEntry,
  type MarkupConfig,
  type ServiceMapEntry,
} from '@/lib/smm/service-map-store'
import { getConfiguredPanelIds, getSmmProviders, isDemoMode, isSmmConfigured, SMM_PANEL_PRESETS } from '@/lib/smm/providers'
import { testSmmKey, validateKeyFormat } from '@/lib/smm/key-validator'
import { getPanelKeyHelp } from '@/lib/smm/panel-key-help'
import { buildWholesaleOverview } from '@/lib/smm/wholesale-overview'

export async function GET() {
  try {
    await requireAdmin()
    await ensureSmmKeyCache()
    clearServiceCache()

    const saved = await listSavedSmmKeys()
    const [map, markup] = await Promise.all([loadServiceMap(), loadMarkupConfig()])

    const presets = SMM_PANEL_PRESETS.map((p) => ({
      id: p.id,
      name: p.name,
      envKey: p.envKey,
      site: p.apiUrl.replace('/api/v2', ''),
      minDeposit: p.minDeposit,
      note: p.note,
      keyVisibility: p.keyVisibility ?? 'masked_once',
      recommended: p.recommended ?? false,
      providerTier: p.providerTier ?? 'reseller',
      keyHelp: getPanelKeyHelp(p.id),
      savedInDb: saved[p.envKey] ?? false,
      fromEnv: Boolean(process.env[p.envKey]),
      configured: getConfiguredPanelIds().includes(p.id),
    }))

    const configured = isSmmConfigured()
    let balances: Array<{ id: string; name: string; balance?: string; currency?: string; ok: boolean; error?: string }> = []
    let providerSummary: Awaited<ReturnType<typeof listProviderSummary>> = []

    if (configured) {
      const providers = getSmmProviders()
      const balanceResults = await Promise.allSettled(
        providers.map(async (p) => {
          try {
            const b = await fetchSmmBalance(p.id)
            return { id: p.id, name: p.name, balance: b.balance, currency: b.currency, ok: true as const }
          } catch (err) {
            return {
              id: p.id,
              name: p.name,
              ok: false as const,
              error: err instanceof Error ? err.message : 'Bakiye alınamadı',
            }
          }
        })
      )
      balances = balanceResults.map((b) => (b.status === 'fulfilled' ? b.value : { id: '', name: '', ok: false, error: 'Bakiye alınamadı' }))
      try {
        providerSummary = await listProviderSummary()
      } catch {
        /* ignore */
      }
    }

    const services = ALL_SERVICES.flatMap((s) =>
      s.tiers.map((t) => {
        const key = `${s.slug}:${t.id}`
        const entry = map[key] ?? null
        const refPkg = t.packages.find((p) => p.amount === 1000) ?? t.packages[0]
        const profit = entry
          ? calcProfitStats(refPkg.price, entry.rate, refPkg.amount, markup.usdTry)
          : null
        return {
          key,
          slug: s.slug,
          title: s.title,
          platform: s.platform,
          tierId: t.id as PackageTier,
          tierName: t.shortName,
          sellPrice: refPkg.price,
          refAmount: refPkg.amount,
          mapped: Boolean(entry),
          entry,
          profit,
        }
      })
    )

    const mappedCount = services.filter((s) => s.mapped).length
    const totalCount = services.length

    const wholesaleOverview = await buildWholesaleOverview({
      map,
      markup,
      configuredIds: getConfiguredPanelIds(),
      balances,
      demoMode: isDemoMode(),
    })

    return NextResponse.json({
      ok: true,
      configured,
      presets,
      balances,
      providerSummary,
      markup,
      wholesaleOverview,
      mapStats: { mapped: mappedCount, total: totalCount, unmapped: totalCount - mappedCount },
      services,
    })
  } catch {
    return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 403 })
  }
}

const saveKeySchema = z.object({
  action: z.literal('save_key'),
  envKey: z.string(),
  apiKey: z.string(),
})

const testKeySchema = z.object({
  action: z.literal('test_key'),
  envKey: z.string(),
  apiKey: z.string(),
})

const autoMapSchema = z.object({ action: z.literal('auto_map') })

const saveMappingSchema = z.object({
  action: z.literal('save_mapping'),
  slug: z.string(),
  tierId: z.enum(['ucuz', 'standart', 'premium', 'gercek']),
  entry: z.object({
    providerId: z.string(),
    providerName: z.string(),
    serviceId: z.number(),
    serviceName: z.string(),
    rate: z.number(),
    score: z.number().optional(),
  }),
})

const saveMarkupSchema = z.object({
  action: z.literal('save_markup'),
  markup: z.object({
    enabled: z.boolean(),
    usdTry: z.number().min(1),
    autoCheapest: z.boolean(),
    preferTurkish: z.boolean(),
    preferWholesale: z.boolean(),
    minProfitPercent: z.number().min(0).max(90),
    tierMultipliers: z.record(z.string(), z.number()),
  }),
})

const searchSchema = z.object({
  action: z.literal('search_services'),
  providerId: z.string(),
  query: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    await requireAdmin()
    const body = await req.json()
    const action = body.action as string

    if (action === 'test_key') {
      const data = testKeySchema.parse(body)
      const preset = SMM_PANEL_PRESETS.find((p) => p.envKey === data.envKey)
      if (!preset) return NextResponse.json({ ok: false, error: 'Geçersiz panel' }, { status: 400 })

      const format = validateKeyFormat(data.apiKey)
      if (!format.ok) {
        return NextResponse.json({ ok: false, error: format.reason, test: { ok: false, error: format.reason } })
      }

      const test = await testSmmKey(preset.apiUrl, data.apiKey)
      if (!test.ok) {
        return NextResponse.json({ ok: false, error: test.error, test })
      }

      return NextResponse.json({
        ok: true,
        message: `Key geçerli — bakiye: ${test.balance ?? '?'} ${test.currency ?? ''}${test.serviceCount ? ` · ${test.serviceCount} servis` : ''}`,
        test,
      })
    }

    if (action === 'save_key') {
      const data = saveKeySchema.parse(body)
      const preset = SMM_PANEL_PRESETS.find((p) => p.envKey === data.envKey)
      if (!preset) return NextResponse.json({ ok: false, error: 'Geçersiz panel' }, { status: 400 })

      if (data.apiKey) {
        const format = validateKeyFormat(data.apiKey)
        if (!format.ok) {
          return NextResponse.json({ ok: false, error: format.reason }, { status: 400 })
        }

        const test = await testSmmKey(preset.apiUrl, data.apiKey)
        if (!test.ok) {
          return NextResponse.json({
            ok: false,
            error: `Key panel tarafından reddedildi: ${test.error}. Yıldızlı metin veya eski key olabilir — panelden yeni key oluşturun.`,
            test,
          }, { status: 400 })
        }
      }

      await saveSmmKey(data.envKey, data.apiKey)
      clearServiceCache()
      clearMapCache()
      await refreshSmmKeyCache()

      let autoMapMsg = ''
      if (data.apiKey && isSmmConfigured()) {
        try {
          const result = await autoMapAllServices()
          const existing = await loadServiceMap()
          await saveServiceMap({ ...existing, ...result.entries })
          clearServiceCache()
          autoMapMsg = ` · ${result.mapped} servis otomatik eşlendi`
        } catch {
          autoMapMsg = ' · Manuel eşleme gerekebilir'
        }
      }

      return NextResponse.json({
        ok: true,
        message: `${data.apiKey ? `${preset.name} API key kaydedildi${autoMapMsg}` : 'API key silindi'}`,
      })
    }

    if (action === 'auto_map') {
      autoMapSchema.parse(body)
      await ensureSmmKeyCache()
      const result = await autoMapAllServices()
      await saveServiceMap(result.entries)
      clearServiceCache()

      return NextResponse.json({
        ok: true,
        message: `${result.mapped} servis eşlendi, ${result.unmapped} eşleşmedi, ${result.lowMargin} düşük marj`,
        result,
      })
    }

    if (action === 'save_mapping') {
      const data = saveMappingSchema.parse(body)
      const entry: ServiceMapEntry = {
        ...data.entry,
        score: data.entry.score ?? 100,
        auto: false,
        mappedAt: new Date().toISOString(),
      }
      await setMappedEntry(data.slug, data.tierId, entry)
      clearServiceCache()
      return NextResponse.json({ ok: true, message: 'Eşleme kaydedildi' })
    }

    if (action === 'save_markup') {
      const data = saveMarkupSchema.parse(body)
      await saveMarkupConfig(data.markup as MarkupConfig)
      clearMapCache()
      return NextResponse.json({ ok: true, message: 'Kar ayarları kaydedildi' })
    }

    if (action === 'search_services') {
      const data = searchSchema.parse(body)
      const services = await fetchSmmServices(data.providerId)
      const q = data.query?.toLowerCase() ?? ''
      const filtered = q
        ? services.filter((s) => s.name.toLowerCase().includes(q)).slice(0, 50)
        : services.slice(0, 50)
      return NextResponse.json({ ok: true, services: filtered })
    }

    return NextResponse.json({ ok: false, error: 'Geçersiz işlem' }, { status: 400 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'İşlem başarısız'
    return NextResponse.json({ ok: false, error: message }, { status: 400 })
  }
}
