'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type User = {
  id: string
  email: string
  name: string | null
  role: string
  balance: number
  active: boolean
  lastLoginIp: string | null
  banReason: string | null
  bannedAt: string | null
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState(false)

  function load() {
    void fetch('/api/admin/users').then((r) => r.json()).then((d) => { if (d.ok) setUsers(d.users) })
  }

  useEffect(() => { load() }, [])

  async function action(body: Record<string, unknown>, confirmMsg?: string) {
    if (confirmMsg && !window.confirm(confirmMsg)) return
    setMsg(null)
    setErr(false)
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const d = await res.json()
    if (d.ok) {
      setMsg(d.message ?? 'İşlem başarılı')
      load()
    } else {
      setErr(true)
      setMsg(d.error ?? 'Hata')
    }
  }

  async function toggleAdmin(id: string, role: string) {
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: id, role: role === 'admin' ? 'user' : 'admin' }),
    })
    const d = await res.json()
    setErr(!d.ok)
    setMsg(d.ok ? 'Rol güncellendi' : d.error)
    load()
  }

  return (
    <main className="p-4 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#33353E]">Kullanıcı Yönetimi</h1>
        <p className="mt-1 text-sm text-[#666F94]">
          Engelle, IP ban, sil. Her kullanıcı yalnızca kendi panelini görür —{' '}
          <Link href="/admin/guvenlik" className="font-bold text-[#7844E4]">Güvenlik Merkezi</Link>
        </p>
      </div>

      {msg && (
        <p className={`mb-4 rounded-xl p-3 text-sm ${err ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {msg}
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-[#666F94]">
              <th className="p-3">E-posta</th>
              <th className="p-3">Rol</th>
              <th className="p-3">Bakiye</th>
              <th className="p-3">Son IP</th>
              <th className="p-3">Durum</th>
              <th className="p-3">Güvenlik</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className={`border-b border-[#E9EBF5] ${!u.active ? 'bg-red-50/50' : ''}`}>
                <td className="p-3">
                  <p className="font-medium">{u.email}</p>
                  {u.banReason && <p className="text-xs text-red-600">{u.banReason}</p>}
                </td>
                <td className="p-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${u.role === 'admin' ? 'bg-[#EDE5FF] text-[#7844E4]' : 'bg-[#F0F1F9] text-[#666F94]'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-3 font-semibold">{u.balance.toFixed(2)} ₺</td>
                <td className="p-3 font-mono text-xs text-[#666F94]">{u.lastLoginIp ?? '—'}</td>
                <td className="p-3">
                  <span className={`text-xs font-bold ${u.active ? 'text-green-600' : 'text-red-600'}`}>
                    {u.active ? 'Aktif' : 'Engelli'}
                  </span>
                </td>
                <td className="p-3">
                  {u.role === 'admin' ? (
                    <span className="text-xs text-[#666F94]">Korunmuş</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {u.active ? (
                        <>
                          <button
                            type="button"
                            onClick={() => action({ action: 'ban', userId: u.id, banIp: true, reason: 'Admin engeli' }, `${u.email} engellensin ve IP ban atılsın mı?`)}
                            className="rounded-lg bg-red-100 px-2 py-1 text-xs font-bold text-red-700 hover:bg-red-200"
                          >
                            Engelle + IP Ban
                          </button>
                          <button
                            type="button"
                            onClick={() => action({ action: 'ban_ip', userId: u.id }, `${u.email} IP ban (${u.lastLoginIp ?? 'IP yok'})?`)}
                            className="rounded-lg bg-orange-100 px-2 py-1 text-xs font-bold text-orange-700 hover:bg-orange-200"
                          >
                            IP Ban
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => action({ action: 'unban', userId: u.id })}
                          className="rounded-lg bg-green-100 px-2 py-1 text-xs font-bold text-green-700"
                        >
                          Engeli Kaldır
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => action({ action: 'delete', userId: u.id }, `${u.email} kalıcı silinsin mi? Geri alınamaz!`)}
                        className="rounded-lg bg-[#F0F1F9] px-2 py-1 text-xs font-bold text-[#666F94] hover:bg-red-100 hover:text-red-700"
                      >
                        Sil
                      </button>
                      <button type="button" onClick={() => toggleAdmin(u.id, u.role)} className="rounded-lg px-2 py-1 text-xs font-bold text-[#7844E4] hover:underline">
                        Admin yap
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
