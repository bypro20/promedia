'use client'

import { useEffect, useState } from 'react'

type User = { id: string; email: string; name: string | null; role: string; balance: number; active: boolean }

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [selected, setSelected] = useState('')
  const [amount, setAmount] = useState('100')

  function load() {
    void fetch('/api/admin/users').then((r) => r.json()).then((d) => { if (d.ok) setUsers(d.users) })
  }

  useEffect(() => { load() }, [])

  async function addBalance() {
    if (!selected) return
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: selected, addBalance: Number(amount), note: 'Admin yükleme' }),
    })
    load()
  }

  async function toggleAdmin(id: string, role: string) {
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: id, role: role === 'admin' ? 'user' : 'admin' }),
    })
    load()
  }

  return (
    <main className="p-6 lg:p-8">
      <h1 className="text-2xl font-black">Kullanıcılar</h1>
      <div className="mt-6 flex flex-wrap gap-2 rounded-2xl bg-white p-4 shadow-sm">
        <select value={selected} onChange={(e) => setSelected(e.target.value)} className="rounded-xl border px-3 py-2 text-sm">
          <option value="">Kullanıcı seç</option>
          {users.map((u) => <option key={u.id} value={u.id}>{u.email} ({u.balance.toFixed(2)} ₺)</option>)}
        </select>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-24 rounded-xl border px-3 py-2 text-sm" />
        <button type="button" onClick={addBalance} className="rounded-xl bg-[#10B981] px-4 py-2 text-sm font-bold text-white">Bakiye Ekle</button>
      </div>
      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead><tr className="border-b text-left text-xs text-[#666F94]"><th className="p-3">E-posta</th><th className="p-3">Rol</th><th className="p-3">Bakiye</th><th className="p-3">İşlem</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">{u.balance.toFixed(2)} ₺</td>
                <td className="p-3">
                  <button type="button" onClick={() => toggleAdmin(u.id, u.role)} className="text-xs font-bold text-[#7844E4]">
                    {u.role === 'admin' ? 'Admin Kaldır' : 'Admin Yap'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
