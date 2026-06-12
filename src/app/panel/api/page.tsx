'use client'

import { useEffect, useState } from 'react'

const ENDPOINTS = [
  { method: 'GET', path: '/api/v1/balance', desc: 'Bakiye sorgula' },
  { method: 'GET', path: '/api/v1/services', desc: 'Hizmet listesi ve paketler' },
  { method: 'POST', path: '/api/v1/order', desc: 'Sipariş oluştur (bakiyeden düşer)' },
  { method: 'GET', path: '/api/v1/status?order=PM-123456', desc: 'Sipariş durumu' },
]

export default function PanelApiPage() {
  const [keys, setKeys] = useState<Array<{ id: string; key: string; label: string | null }>>([])
  const [label, setLabel] = useState('API Key')
  const base = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prmdia.com')

  function load() {
    void fetch('/api/panel/api-keys').then((r) => r.json()).then((d) => { if (d.ok) setKeys(d.keys) })
  }

  useEffect(() => { load() }, [])

  async function createKey() {
    await fetch('/api/panel/api-keys', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ label }) })
    load()
  }

  return (
    <main className="p-6 lg:p-8">
      <h1 className="text-2xl font-black">Reseller API</h1>
      <p className="mt-2 text-sm text-[#666F94]">Kendi sitenize entegre edin — tüm isteklerde Authorization header kullanın.</p>

      <div className="mt-6 max-w-lg rounded-2xl bg-white p-5 shadow-sm">
        <input value={label} onChange={(e) => setLabel(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm" placeholder="Etiket" />
        <button type="button" onClick={createKey} className="mt-3 rounded-xl bg-[#7844E4] px-4 py-2 text-sm font-bold text-white">Yeni Key Oluştur</button>
        <ul className="mt-4 space-y-2">
          {keys.map((k) => (
            <li key={k.id} className="rounded-lg bg-[#F0F1F9] p-3 font-mono text-xs break-all">{k.key}</li>
          ))}
        </ul>
      </div>

      <div className="mt-8 rounded-2xl bg-[#282D40] p-5 text-sm text-white">
        <p className="font-bold">Kimlik doğrulama</p>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-black/30 p-3 text-xs">{`Authorization: Bearer pm_your_api_key`}</pre>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-bold">Endpoint&apos;ler</h2>
        <ul className="mt-3 space-y-3 text-sm">
          {ENDPOINTS.map((e) => (
            <li key={e.path} className="border-b border-[#E9EBF5] pb-3">
              <span className="rounded bg-[#EDE5FF] px-2 py-0.5 font-mono text-xs font-bold text-[#7844E4]">{e.method}</span>
              <code className="ml-2 text-xs">{base}{e.path}</code>
              <p className="mt-1 text-[#666F94]">{e.desc}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-bold">Örnek sipariş</h2>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-[#F0F1F9] p-3 text-xs">{`curl -X POST ${base}/api/v1/order \\
  -H "Authorization: Bearer pm_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "service": "instagram-takipci-satin-al",
    "tier": "standart",
    "package": "pkg-2",
    "target": "kullaniciadi"
  }'`}</pre>
      </div>

      <p className="mt-4 text-xs text-[#666F94]">Rate limit: 60–120 istek/dakika. PayTR onaylandığında otomatik ödeme webhook eklenecektir.</p>
    </main>
  )
}
