'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PanelRefillPage() {
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/orders/refill', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, email: '' }),
    })
    const d = await res.json()
    setMsg(d.ok ? d.message : d.error)
  }

  return (
    <main className="p-6 lg:p-8">
      <h1 className="text-2xl font-black">Telafi Talebi</h1>
      <form onSubmit={submit} className="mt-6 max-w-md space-y-4 rounded-2xl bg-white p-5 shadow-sm">
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="PM-123456" required className="w-full rounded-xl border px-3 py-2.5 text-sm" />
        <button type="submit" className="w-full rounded-xl bg-[#7844E4] py-2.5 text-sm font-bold text-white">Telafi Başlat</button>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
      <Link href="/panel/siparisler" className="mt-4 inline-block text-sm font-bold text-[#7844E4]">← Siparişlerim</Link>
    </main>
  )
}
