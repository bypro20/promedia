'use client'

import { useEffect, useState } from 'react'

export default function PanelApiPage() {
  const [keys, setKeys] = useState<Array<{ id: string; key: string; label: string | null }>>([])
  const [label, setLabel] = useState('API Key')

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
      <h1 className="text-2xl font-black">API Anahtarı</h1>
      <p className="mt-2 text-sm text-[#666F94]">Reseller API — kendi sisteminize entegre edin</p>
      <div className="mt-6 max-w-lg rounded-2xl bg-white p-5 shadow-sm">
        <input value={label} onChange={(e) => setLabel(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm" placeholder="Etiket" />
        <button type="button" onClick={createKey} className="mt-3 rounded-xl bg-[#7844E4] px-4 py-2 text-sm font-bold text-white">Yeni Key Oluştur</button>
        <ul className="mt-4 space-y-2">
          {keys.map((k) => (
            <li key={k.id} className="rounded-lg bg-[#F0F1F9] p-3 font-mono text-xs break-all">{k.key}</li>
          ))}
        </ul>
      </div>
    </main>
  )
}
