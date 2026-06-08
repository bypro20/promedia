'use client'

import { useEffect, useState } from 'react'

export default function PanelProfilePage() {
  const [user, setUser] = useState<{ name: string | null; email: string; balance: number; hasPassword: boolean } | null>(null)
  const [name, setName] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    void fetch('/api/panel/profile').then((r) => r.json()).then((d) => {
      if (d.ok) { setUser(d.user); setName(d.user.name ?? '') }
    })
  }, [])

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/panel/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) })
    const d = await res.json()
    setMsg(d.ok ? 'Profil kaydedildi' : d.error)
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/panel/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    })
    const d = await res.json()
    setMsg(d.ok ? 'Şifre güncellendi' : d.error)
    if (d.ok) { setCurrentPassword(''); setNewPassword('') }
  }

  if (!user) return <main className="p-8">Yükleniyor…</main>

  return (
    <main className="p-6 lg:p-8">
      <h1 className="text-2xl font-black">Profil</h1>

      <form onSubmit={saveProfile} className="mt-6 max-w-md space-y-4 rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-bold">Hesap Bilgileri</h2>
        <div><label className="text-xs font-bold text-[#666F94]">E-posta</label><p className="font-semibold">{user.email}</p></div>
        <div>
          <label className="text-xs font-bold text-[#666F94]">Ad Soyad</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" />
        </div>
        <button type="submit" className="rounded-xl bg-[#7844E4] px-4 py-2 text-sm font-bold text-white">Kaydet</button>
      </form>

      {user.hasPassword && (
        <form onSubmit={changePassword} className="mt-6 max-w-md space-y-4 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-bold">Şifre Değiştir</h2>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Mevcut şifre" className="w-full rounded-xl border px-3 py-2 text-sm" required />
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Yeni şifre (min. 6)" minLength={6} className="w-full rounded-xl border px-3 py-2 text-sm" required />
          <button type="submit" className="rounded-xl bg-[#7844E4] px-4 py-2 text-sm font-bold text-white">Şifreyi Güncelle</button>
        </form>
      )}

      {msg && <p className="mt-4 text-sm text-green-600">{msg}</p>}
    </main>
  )
}
