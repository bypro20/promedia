'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { KEY_CAPTURE_SCRIPT } from '@/lib/smm/panel-key-help'
import type { KeyVisibility, PanelKeyHelp } from '@/lib/smm/panel-key-help'
import type { WholesaleOverview } from '@/lib/smm/wholesale-overview'
import { SmmWholesaleOverview } from '@/components/admin/smm-wholesale-overview'

type Preset = {
  id: string
  name: string
  envKey: string
  site: string
  minDeposit?: string
  note?: string
  keyVisibility: KeyVisibility
  recommended: boolean
  providerTier: 'wholesale' | 'reseller'
  keyHelp: PanelKeyHelp
  savedInDb: boolean
  fromEnv: boolean
  configured: boolean
}

type Balance = { id: string; name: string; balance?: string; currency?: string; ok: boolean; error?: string }

type ServiceRow = {
  key: string
  slug: string
  title: string
  platform: string
  tierId: string
  tierName: string
  sellPrice: number
  refAmount: number
  mapped: boolean
  entry: { providerId: string; providerName: string; serviceId: number; serviceName: string; rate: number } | null
  profit: { cost: number; profit: number; margin: number } | null
}

type Markup = {
  enabled: boolean
  usdTry: number
  autoCheapest: boolean
  preferTurkish: boolean
  preferWholesale: boolean
  minProfitPercent: number
  tierMultipliers: Record<string, number>
}

type Dashboard = {
  configured: boolean
  presets: Preset[]
  balances: Balance[]
  markup: Markup
  mapStats: { mapped: number; total: number; unmapped: number }
  services: ServiceRow[]
  wholesaleOverview?: WholesaleOverview
}

type Tab = 'overview' | 'panels' | 'mapping' | 'profit'

type KeyTestState = {
  ok: boolean
  balance?: string
  currency?: string
  serviceCount?: number
  error?: string
}

function visibilityLabel(v: KeyVisibility) {
  if (v === 'visible') return { text: 'Key görünür', cls: 'bg-green-100 text-green-700' }
  if (v === 'always_masked') return { text: 'Key yıldızlı', cls: 'bg-amber-100 text-amber-800' }
  return { text: 'Tek seferlik', cls: 'bg-orange-100 text-orange-800' }
}

export function SmmDashboard() {
  const [data, setData] = useState<Dashboard | null>(null)
  const [tab, setTab] = useState<Tab>('overview')
  const [keys, setKeys] = useState<Record<string, string>>({})
  const [msg, setMsg] = useState<string | null>(null)
  const [msgError, setMsgError] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const [filter, setFilter] = useState('')
  const [onlyUnmapped, setOnlyUnmapped] = useState(false)
  const [markup, setMarkup] = useState<Markup | null>(null)
  const [expandedHelp, setExpandedHelp] = useState<string | null>(null)
  const [keyTests, setKeyTests] = useState<Record<string, KeyTestState>>({})
  const [showCaptureHelp, setShowCaptureHelp] = useState(false)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/smm')
    const d = await res.json()
    if (d.ok) {
      setData(d)
      setMarkup(d.markup)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  async function testKey(envKey: string) {
    const apiKey = keys[envKey] ?? ''
    if (!apiKey.trim()) {
      setMsg('Test için önce API key yapıştırın')
      setMsgError(true)
      return
    }
    setLoading(`test_${envKey}`)
    setMsg(null)
    setMsgError(false)
    try {
      const res = await fetch('/api/admin/smm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test_key', envKey, apiKey }),
      })
      const d = await res.json()
      if (!d.ok) {
        setKeyTests((t) => ({ ...t, [envKey]: { ok: false, error: d.error ?? d.test?.error } }))
        throw new Error(d.error)
      }
      setKeyTests((t) => ({ ...t, [envKey]: d.test }))
      setMsg(d.message)
      setMsgError(false)
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Key testi başarısız')
      setMsgError(true)
    } finally {
      setLoading(null)
    }
  }

  async function saveKey(envKey: string) {
    setLoading(envKey)
    setMsg(null)
    setMsgError(false)
    try {
      const res = await fetch('/api/admin/smm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_key', envKey, apiKey: keys[envKey] ?? '' }),
      })
      const d = await res.json()
      if (!d.ok) {
        if (d.test) setKeyTests((t) => ({ ...t, [envKey]: d.test }))
        throw new Error(d.error)
      }
      setMsg(d.message)
      setMsgError(false)
      setKeys((k) => ({ ...k, [envKey]: '' }))
      setKeyTests((t) => { const n = { ...t }; delete n[envKey]; return n })
      await load()
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Hata')
      setMsgError(true)
    } finally {
      setLoading(null)
    }
  }

  async function deleteKey(envKey: string, panelName: string) {
    if (!confirm(`${panelName} kayıtlı API key silinsin mi?`)) return
    setKeys((k) => ({ ...k, [envKey]: '' }))
    await saveKey(envKey)
  }

  function copyCaptureScript() {
    void navigator.clipboard.writeText(KEY_CAPTURE_SCRIPT)
    setMsg('Key yakalayıcı script panoya kopyalandı — panel sayfasında F12 → Console\'a yapıştırın')
    setMsgError(false)
  }

  async function autoMap() {
    setLoading('auto_map')
    setMsg(null)
    try {
      const res = await fetch('/api/admin/smm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'auto_map' }),
      })
      const d = await res.json()
      if (!d.ok) throw new Error(d.error)
      setMsg(d.message)
      await load()
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Hata')
    } finally {
      setLoading(null)
    }
  }

  async function saveMarkupSettings() {
    if (!markup) return
    setLoading('markup')
    try {
      const res = await fetch('/api/admin/smm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_markup', markup }),
      })
      const d = await res.json()
      if (!d.ok) throw new Error(d.error)
      setMsg(d.message)
      await load()
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Hata')
    } finally {
      setLoading(null)
    }
  }

  const sortedPresets = useMemo(() => {
    if (!data) return []
    return [...data.presets].sort((a, b) => {
      if (a.providerTier !== b.providerTier) return a.providerTier === 'wholesale' ? -1 : 1
      if (a.recommended !== b.recommended) return a.recommended ? -1 : 1
      const vis = { visible: 0, masked_once: 1, always_masked: 2 }
      return vis[a.keyVisibility] - vis[b.keyVisibility]
    })
  }, [data])

  const wholesalePresets = useMemo(() => sortedPresets.filter((p) => p.providerTier === 'wholesale'), [sortedPresets])
  const resellerPresets = useMemo(() => sortedPresets.filter((p) => p.providerTier === 'reseller'), [sortedPresets])

  const maskedCount = useMemo(
    () => data?.presets.filter((p) => p.keyVisibility !== 'visible').length ?? 0,
    [data]
  )

  const filteredServices = useMemo(() => {
    if (!data) return []
    return data.services.filter((s) => {
      if (onlyUnmapped && s.mapped) return false
      if (!filter.trim()) return true
      const q = filter.toLowerCase()
      return s.title.toLowerCase().includes(q) || s.platform.toLowerCase().includes(q) || s.tierName.toLowerCase().includes(q)
    })
  }, [data, filter, onlyUnmapped])

  if (!data) {
    return <main className="p-8 text-sm text-[#666F94]">SMM panel yükleniyor…</main>
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Toptan Merkez' },
    { id: 'panels', label: 'Paneller & API' },
    { id: 'mapping', label: `Servis Eşleme (${data.mapStats.mapped}/${data.mapStats.total})` },
    { id: 'profit', label: 'Kar Ayarları' },
  ]

  return (
    <main className="p-4 lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#33353E]">SMM Panel Merkezi</h1>
          <p className="mt-1 text-sm text-[#666F94]">
            API key ekleyin → otomatik eşle → tüm {data.mapStats.total} servis kademesi karlı şekilde çalışsın
          </p>
        </div>
        <button
          type="button"
          disabled={!data.configured || loading === 'auto_map'}
          onClick={autoMap}
          className="rounded-xl bg-[#10B981] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0d9668] disabled:opacity-50"
        >
          {loading === 'auto_map' ? 'Eşleniyor…' : '⚡ Tüm Servisleri Otomatik Eşle'}
        </button>
      </div>

      {msg && (
        <p className={`mt-4 rounded-xl px-4 py-2 text-sm font-semibold ${msgError ? 'bg-red-50 text-red-700' : 'bg-[#EDE5FF] text-[#7844E4]'}`}>
          {msg}
        </p>
      )}

      {!data.configured && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Demo mod aktif — <strong>PRM4U (Toptan)</strong> API key girin. Müşteri ödeme yapınca sipariş otomatik toptancıya gider.
        </div>
      )}

      {data.configured && data.balances.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {data.balances.map((b) => (
            <div key={b.id} className={`rounded-2xl p-4 shadow-sm ${b.ok ? 'bg-white' : 'bg-red-50 border border-red-200'}`}>
              <p className="text-xs font-bold uppercase text-[#666F94]">{b.name}</p>
              {b.ok ? (
                <p className="mt-1 text-xl font-black text-[#7844E4]">
                  {`${b.balance ?? '—'} ${b.currency ?? ''}`}
                </p>
              ) : (
                <p className="mt-1 text-sm font-bold text-red-600">
                  {b.error?.toLowerCase().includes('invalid api key')
                    ? 'Geçersiz API key — panelden yeni key oluşturun'
                    : 'Key geçersiz — yeni key oluşturup Test Et'}
                </p>
              )}
              {!b.ok && b.error && (
                <p className="mt-1 text-xs text-red-500">{b.error}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex gap-2 border-b border-[#E9EBF5]">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-bold ${tab === t.id ? 'border-b-2 border-[#7844E4] text-[#7844E4]' : 'text-[#666F94]'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && data.wholesaleOverview && (
        <SmmWholesaleOverview overview={data.wholesaleOverview} configured={data.configured} />
      )}

      {tab === 'panels' && (
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-bold text-amber-900">Yıldızlı (****) API key sorunu</h2>
                <p className="mt-1 text-sm text-amber-800">
                  {maskedCount} panel key&apos;i güvenlik için gizler. Yıldızlı metni kopyalamayın — geçersiz sayılır.
                  Panelde <strong>yeni key oluşturun</strong> ve oluşturulduğu anda kopyalayın, sonra burada <strong>Test Et</strong> ile doğrulayın.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCaptureHelp((v) => !v)}
                className="rounded-xl bg-amber-200 px-4 py-2 text-sm font-bold text-amber-900 hover:bg-amber-300"
              >
                {showCaptureHelp ? 'Gizle' : 'Key Yakalayıcı'}
              </button>
            </div>
            {showCaptureHelp && (
              <div className="mt-4 space-y-3 rounded-xl bg-white p-4 text-sm text-[#33353E]">
                <ol className="list-decimal space-y-1 pl-5">
                  <li>Panel sitesine giriş yapın (MedyaBayim, SmmServisim vb.)</li>
                  <li>F12 → Console sekmesini açın</li>
                  <li>Aşağıdaki butonla script&apos;i kopyalayıp Console&apos;a yapıştırın</li>
                  <li>Panelde &quot;Yeni API Key&quot; oluşturun — script key&apos;i yakalar ve panoya kopyalar</li>
                  <li>Buraya yapıştırıp Test Et → Kaydet</li>
                </ol>
                <button
                  type="button"
                  onClick={copyCaptureScript}
                  className="rounded-xl bg-[#7844E4] px-4 py-2 text-sm font-bold text-white"
                >
                  Yakalayıcı Script&apos;i Kopyala
                </button>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <p className="font-bold">Ana bayi (toptan) panelleri</p>
            <p className="mt-1">
              PRM4U gibi toptan API&apos;leri ekleyin — sistem tüm aktif paneller arasından en ucuz ve karlı servisi otomatik seçer.
              En az 2–3 toptan panel önerilir (yedek + fiyat karşılaştırması).
            </p>
          </div>

          {wholesalePresets.map((p) => {
            const vis = visibilityLabel(p.keyVisibility)
            const test = keyTests[p.envKey]
            const isTesting = loading === `test_${p.envKey}`
            const isSaving = loading === p.envKey

            return (
              <div key={p.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-emerald-100">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-bold">{p.name}</h2>
                      {p.recommended && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">Önerilen</span>
                      )}
                      {p.providerTier === 'wholesale' && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">Toptan</span>
                      )}
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${vis.cls}`}>{vis.text}</span>
                    </div>
                    <a href={p.site} target="_blank" rel="noreferrer" className="text-xs text-[#7844E4] hover:underline">
                      {p.site} · min {p.minDeposit}
                    </a>
                    {p.note && <p className="mt-1 text-xs text-[#666F94]">{p.note}</p>}
                  </div>
                  <div className="flex gap-2 text-xs">
                    {p.fromEnv && <span className="rounded-full bg-green-100 px-2 py-1 text-green-700">Env ✓</span>}
                    {p.savedInDb && <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700">DB ✓</span>}
                    {p.configured && <span className="rounded-full bg-[#EDE5FF] px-2 py-1 text-[#7844E4]">Aktif</span>}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <input
                    type="password"
                    placeholder={`32 karakterlik API key — yıldızlı metin yapıştırmayın`}
                    value={keys[p.envKey] ?? ''}
                    onChange={(e) => {
                      setKeys((k) => ({ ...k, [p.envKey]: e.target.value }))
                      setKeyTests((t) => { const n = { ...t }; delete n[p.envKey]; return n })
                    }}
                    className="min-w-[200px] flex-1 rounded-xl border px-3 py-2 text-sm outline-none focus:border-[#7844E4]"
                  />
                  <button
                    type="button"
                    disabled={isTesting || isSaving}
                    onClick={() => testKey(p.envKey)}
                    className="rounded-xl border border-[#7844E4] px-4 py-2 text-sm font-bold text-[#7844E4] disabled:opacity-60"
                  >
                    {isTesting ? 'Test…' : 'Test Et'}
                  </button>
                  <button
                    type="button"
                    disabled={isSaving || isTesting}
                    onClick={() => saveKey(p.envKey)}
                    className="rounded-xl bg-[#7844E4] px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
                  >
                    {isSaving ? 'Kaydediliyor…' : 'Kaydet'}
                  </button>
                  {p.savedInDb && (
                    <button
                      type="button"
                      disabled={isSaving || isTesting}
                      onClick={() => deleteKey(p.envKey, p.name)}
                      className="rounded-xl border border-red-200 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-60"
                    >
                      Key Sil
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setExpandedHelp(expandedHelp === p.id ? null : p.id)}
                    className="rounded-xl px-3 py-2 text-sm font-bold text-[#666F94] hover:bg-[#F0F1F9]"
                  >
                    {expandedHelp === p.id ? '▲' : 'Key nasıl alınır?'}
                  </button>
                </div>

                {test && (
                  <p className={`mt-2 text-xs font-semibold ${test.ok ? 'text-green-600' : 'text-red-600'}`}>
                    {test.ok
                      ? `✓ Geçerli — bakiye: ${test.balance ?? '?'} ${test.currency ?? ''}${test.serviceCount ? ` · ${test.serviceCount} servis` : ''}`
                      : `✗ ${test.error}`}
                  </p>
                )}

                {expandedHelp === p.id && (
                  <div className="mt-3 rounded-xl bg-[#F0F1F9] p-4 text-sm">
                    <ol className="list-decimal space-y-1 pl-5 text-[#33353E]">
                      {p.keyHelp.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                    {p.keyHelp.regenerateHint && (
                      <p className="mt-2 text-xs text-amber-700">💡 {p.keyHelp.regenerateHint}</p>
                    )}
                    {p.keyHelp.supportEmail && (
                      <p className="mt-2 text-xs text-[#666F94]">Destek: {p.keyHelp.supportEmail}</p>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {resellerPresets.length > 0 && (
            <div className="pt-2">
              <h3 className="text-sm font-bold uppercase tracking-wide text-[#666F94]">TR aracı paneller (yedek)</h3>
              <p className="mt-1 text-xs text-[#666F94]">Türk paneller aracıdır — toptan paneller aktifken yalnızca yedek olarak kullanın.</p>
            </div>
          )}

          {resellerPresets.map((p) => {
            const vis = visibilityLabel(p.keyVisibility)
            const test = keyTests[p.envKey]
            const isTesting = loading === `test_${p.envKey}`
            const isSaving = loading === p.envKey

            return (
              <div key={p.id} className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-bold">{p.name}</h2>
                      {p.recommended && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">Önerilen</span>
                      )}
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${vis.cls}`}>{vis.text}</span>
                    </div>
                    <a href={p.site} target="_blank" rel="noreferrer" className="text-xs text-[#7844E4] hover:underline">
                      {p.site} · min {p.minDeposit}
                    </a>
                    {p.note && <p className="mt-1 text-xs text-[#666F94]">{p.note}</p>}
                  </div>
                  <div className="flex gap-2 text-xs">
                    {p.fromEnv && <span className="rounded-full bg-green-100 px-2 py-1 text-green-700">Env ✓</span>}
                    {p.savedInDb && <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700">DB ✓</span>}
                    {p.configured && <span className="rounded-full bg-[#EDE5FF] px-2 py-1 text-[#7844E4]">Aktif</span>}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <input
                    type="password"
                    placeholder={`32 karakterlik API key — yıldızlı metin yapıştırmayın`}
                    value={keys[p.envKey] ?? ''}
                    onChange={(e) => {
                      setKeys((k) => ({ ...k, [p.envKey]: e.target.value }))
                      setKeyTests((t) => { const n = { ...t }; delete n[p.envKey]; return n })
                    }}
                    className="min-w-[200px] flex-1 rounded-xl border px-3 py-2 text-sm outline-none focus:border-[#7844E4]"
                  />
                  <button
                    type="button"
                    disabled={isTesting || isSaving}
                    onClick={() => testKey(p.envKey)}
                    className="rounded-xl border border-[#7844E4] px-4 py-2 text-sm font-bold text-[#7844E4] disabled:opacity-60"
                  >
                    {isTesting ? 'Test…' : 'Test Et'}
                  </button>
                  <button
                    type="button"
                    disabled={isSaving || isTesting}
                    onClick={() => saveKey(p.envKey)}
                    className="rounded-xl bg-[#7844E4] px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
                  >
                    {isSaving ? 'Kaydediliyor…' : 'Kaydet'}
                  </button>
                  {p.savedInDb && (
                    <button
                      type="button"
                      disabled={isSaving || isTesting}
                      onClick={() => deleteKey(p.envKey, p.name)}
                      className="rounded-xl border border-red-200 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-60"
                    >
                      Key Sil
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setExpandedHelp(expandedHelp === p.id ? null : p.id)}
                    className="rounded-xl px-3 py-2 text-sm font-bold text-[#666F94] hover:bg-[#F0F1F9]"
                  >
                    {expandedHelp === p.id ? '▲' : 'Key nasıl alınır?'}
                  </button>
                </div>

                {test && (
                  <p className={`mt-2 text-xs font-semibold ${test.ok ? 'text-green-600' : 'text-red-600'}`}>
                    {test.ok
                      ? `✓ Geçerli — bakiye: ${test.balance ?? '?'} ${test.currency ?? ''}${test.serviceCount ? ` · ${test.serviceCount} servis` : ''}`
                      : `✗ ${test.error}`}
                  </p>
                )}

                {expandedHelp === p.id && (
                  <div className="mt-3 rounded-xl bg-[#F0F1F9] p-4 text-sm">
                    <ol className="list-decimal space-y-1 pl-5 text-[#33353E]">
                      {p.keyHelp.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                    {p.keyHelp.regenerateHint && (
                      <p className="mt-2 text-xs text-amber-700">💡 {p.keyHelp.regenerateHint}</p>
                    )}
                    {p.keyHelp.supportEmail && (
                      <p className="mt-2 text-xs text-[#666F94]">Destek: {p.keyHelp.supportEmail}</p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {tab === 'mapping' && (
        <div className="mt-6">
          <div className="mb-4 flex flex-wrap gap-3">
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Hizmet veya platform ara..."
              className="rounded-xl border px-3 py-2 text-sm"
            />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={onlyUnmapped} onChange={(e) => setOnlyUnmapped(e.target.checked)} />
              Sadece eşlenmemiş
            </label>
          </div>
          <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-[#666F94]">
                  <th className="p-3">Hizmet</th>
                  <th className="p-3">Kademe</th>
                  <th className="p-3">Satış</th>
                  <th className="p-3">SMM Panel</th>
                  <th className="p-3">Servis ID</th>
                  <th className="p-3">Maliyet</th>
                  <th className="p-3">Kar %</th>
                  <th className="p-3">Durum</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.slice(0, 100).map((s) => (
                  <tr key={s.key} className="border-b hover:bg-[#F0F1F9]/50">
                    <td className="p-3 max-w-[200px]">
                      <p className="font-semibold truncate">{s.title}</p>
                      <p className="text-xs text-[#666F94]">{s.platform}</p>
                    </td>
                    <td className="p-3">{s.tierName}</td>
                    <td className="p-3 font-bold">{s.sellPrice.toFixed(0)} ₺</td>
                    <td className="p-3 text-xs">{s.entry?.providerName ?? '—'}</td>
                    <td className="p-3 font-mono text-xs">{s.entry?.serviceId ?? '—'}</td>
                    <td className="p-3">{s.profit ? `${s.profit.cost.toFixed(1)} ₺` : '—'}</td>
                    <td className="p-3">
                      {s.profit && (
                        <span className={`font-bold ${s.profit.margin >= (data.markup.minProfitPercent ?? 35) ? 'text-green-600' : 'text-amber-600'}`}>
                          %{s.profit.margin}
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      {s.mapped ? (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">✓</span>
                      ) : (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">✗</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredServices.length > 100 && (
              <p className="p-3 text-xs text-[#666F94]">İlk 100 kayıt gösteriliyor — filtre kullanın</p>
            )}
          </div>
        </div>
      )}

      {tab === 'profit' && markup && (
        <div className="mt-6 max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-bold">Kar Marjı Ayarları</h2>
          <div>
            <label className="text-xs font-bold text-[#666F94]">USD/TRY kuru</label>
            <input type="number" value={markup.usdTry} onChange={(e) => setMarkup({ ...markup, usdTry: Number(e.target.value) })} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-bold text-[#666F94]">Min. kar marjı (%)</label>
            <input type="number" value={markup.minProfitPercent} onChange={(e) => setMarkup({ ...markup, minProfitPercent: Number(e.target.value) })} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={markup.autoCheapest} onChange={(e) => setMarkup({ ...markup, autoCheapest: e.target.checked })} />
            En ucuz paneli otomatik seç
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={markup.preferWholesale ?? true} onChange={(e) => setMarkup({ ...markup, preferWholesale: e.target.checked })} />
            Toptancı API önceliği (PRM4U, JAP — aracı panel yerine)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={markup.preferTurkish} onChange={(e) => setMarkup({ ...markup, preferTurkish: e.target.checked })} />
            Türk aracı panelleri tercih et (yedek)
          </label>
          <div className="space-y-2">
            <p className="text-xs font-bold text-[#666F94]">Kademe çarpanları (satış fiyatı)</p>
            {(['ucuz', 'standart', 'premium', 'gercek'] as const).map((t) => (
              <div key={t} className="flex items-center justify-between">
                <span className="text-sm capitalize">{t}</span>
                <input
                  type="number"
                  step={0.1}
                  value={markup.tierMultipliers[t] ?? 2}
                  onChange={(e) => setMarkup({
                    ...markup,
                    tierMultipliers: { ...markup.tierMultipliers, [t]: Number(e.target.value) },
                  })}
                  className="w-24 rounded-lg border px-2 py-1 text-sm"
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            disabled={loading === 'markup'}
            onClick={saveMarkupSettings}
            className="w-full rounded-xl bg-[#7844E4] py-2.5 text-sm font-bold text-white"
          >
            Kaydet
          </button>
          <p className="text-xs text-[#666F94]">
            Otomatik eşleme, min. kar marjını karşılayan en ucuz SMM servisini seçer. Düşük marjlı eşleşmeler sarı ile işaretlenir.
          </p>
        </div>
      )}
    </main>
  )
}
