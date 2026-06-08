'use client'

import { useCallback, useEffect, useState } from 'react'

type Preset = {
  id: string
  name: string
  envKey: string
  site: string
  savedInDb: boolean
  fromEnv: boolean
}

export default function AdminSmmPage() {
  const [presets, setPresets] = useState<Preset[]>([])
  const [keys, setKeys] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Record<string, unknown> | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)

  const load = useCallback(async () => {
    const [cfg, smm] = await Promise.all([
      fetch('/api/admin/smm').then((r) => r.json()),
      fetch('/api/smm/status?refresh=1').then((r) => r.json()),
    ])
    if (cfg.ok) setPresets(cfg.presets)
    setStatus(smm)
  }, [])

  useEffect(() => { void load() }, [load])

  async function save(envKey: string) {
    setLoading(envKey)
    setMsg(null)
    try {
      const res = await fetch('/api/admin/smm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ envKey, apiKey: keys[envKey] ?? '' }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error ?? 'Kayıt başarısız')
      setMsg(data.message)
      setKeys((k) => ({ ...k, [envKey]: '' }))
      await load()
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Hata')
    } finally {
      setLoading(null)
    }
  }

  return (
    <main className="p-6 lg:p-8">
      <h1 className="text-2xl font-black">SMM Paneller</h1>
      <p className="mt-2 text-sm text-[#666F94]">
        API key&apos;leri buradan kaydedin — otomatik en ucuz panel seçilir.
      </p>

      {msg && (
        <p className="mt-4 rounded-xl bg-[#EDE5FF] px-4 py-2 text-sm font-semibold text-[#7844E4]">{msg}</p>
      )}

      <div className="mt-6 space-y-4">
        {presets.map((p) => (
          <div key={p.id} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-bold">{p.name}</h2>
                <a href={p.site} target="_blank" rel="noreferrer" className="text-xs text-[#7844E4] hover:underline">
                  {p.site}
                </a>
              </div>
              <div className="flex gap-2 text-xs">
                {p.fromEnv && <span className="rounded-full bg-green-100 px-2 py-1 text-green-700">Vercel env ✓</span>}
                {p.savedInDb && <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700">DB kayıtlı ✓</span>}
                {!p.fromEnv && !p.savedInDb && (
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-600">Key yok</span>
                )}
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <input
                type="password"
                placeholder={`${p.envKey} — API key yapıştır`}
                value={keys[p.envKey] ?? ''}
                onChange={(e) => setKeys((k) => ({ ...k, [p.envKey]: e.target.value }))}
                className="flex-1 rounded-xl border border-[#E9EBF5] px-3 py-2 text-sm outline-none focus:border-[#7844E4]"
              />
              <button
                type="button"
                disabled={loading === p.envKey}
                onClick={() => save(p.envKey)}
                className="rounded-xl bg-[#7844E4] px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
              >
                {loading === p.envKey ? '...' : 'Kaydet'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {status && (
        <pre className="mt-8 overflow-auto rounded-2xl bg-[#282D40] p-4 text-xs text-green-400">
          {JSON.stringify(status, null, 2)}
        </pre>
      )}
    </main>
  )
}
