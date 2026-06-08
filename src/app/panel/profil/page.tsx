'use client'

import { useEffect, useState } from 'react'

export default function PanelProfilePage() {
  const [user, setUser] = useState<{ name: string | null; email: string; balance: number } | null>(null)
  const [name, setName] = useState('')
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    void fetch('/api/auth').then((r) => r.json()).then((d) => {
      if (d.ok) { setUser(d.user); setName(d.user.name ?? '') }
    })
  }, [])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/panel/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) })
    const d = await res.json()
    setMsg(d.ok ? 'Kaydedildi' : d.error)
  }

  if (!user) return <main className="p-8">Yükleniyor…</main>

  return (
    <main className="p-6 lg:p-8">
      <h1 className="text-2xl font-black">Profil</h1>
      <form onSubmit={save} className="mt-6 max-w-md space-y-4 rounded-2xl bg-white p-5 shadow-sm">
        <div><label className="text-xs font-bold text-[#666F94]">E-posta</label><p className="font-semibold">{user.email}</p></div>
        <div>
          <label className="text-xs font-bold text-[#666F94]">Ad Soyad</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" />
        </div>
        <button type="submit" className="rounded-xl bg-[#7844E4] px-4 py-2 text-sm font-bold text-white">Kaydet</button>
        {msg && <p className="text-sm text-green-600">{msg}</p>}
      </form>
    </main>
  )
}
