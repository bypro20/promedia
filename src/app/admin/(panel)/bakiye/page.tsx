'use client'

import { useCallback, useEffect, useState } from 'react'

type Deposit = {
  id: string
  amount: number
  method: string
  reference: string | null
  status: string
  createdAt: string
  user: { id: string; email: string; name: string | null; balance: number }
}

type Tx = {
  id: string
  amount: number
  note: string | null
  type: string
  createdAt: string
  user: { email: string }
}

type User = { id: string; email: string; balance: number; role?: string }

export default function AdminBalancePage() {
  const [pending, setPending] = useState<Deposit[]>([])
  const [history, setHistory] = useState<Deposit[]>([])
  const [transactions, setTransactions] = useState<Tx[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [pendingCount, setPendingCount] = useState(0)
  const [manualUser, setManualUser] = useState('')
  const [manualAmount, setManualAmount] = useState('100')
  const [manualNote, setManualNote] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)

  const load = useCallback(async () => {
    const [dep, usersRes] = await Promise.all([
      fetch('/api/admin/deposits').then((r) => r.json()),
      fetch('/api/admin/users').then((r) => r.json()),
    ])
    if (dep.ok) {
      setPending(dep.deposits.filter((d: Deposit) => d.status === 'pending'))
      setHistory(dep.deposits)
      setTransactions(dep.recentTransactions)
      setPendingCount(dep.pendingCount)
    }
    if (usersRes.ok) setUsers(usersRes.users)
  }, [])

  useEffect(() => { void load() }, [load])

  async function review(depositId: string, action: 'approve' | 'reject') {
    setLoading(depositId)
    setMsg(null)
    const res = await fetch('/api/admin/deposits', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, depositId }),
    })
    const d = await res.json()
    setMsg(d.ok ? d.message : d.error)
    setLoading(null)
    if (d.ok) void load()
  }

  async function setUserBalance(e: React.FormEvent) {
    e.preventDefault()
    if (!manualUser) return
    setMsg(null)
    const res = await fetch('/api/admin/deposits', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'set_balance',
        userId: manualUser,
        amount: Number(manualAmount),
        note: manualNote || undefined,
      }),
    })
    const d = await res.json()
    setMsg(d.ok ? d.message : d.error)
    if (d.ok) void load()
  }

  return (
    <main className="p-4 lg:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#33353E]">Bakiye Yükleme Talepleri</h1>
          <p className="mt-1 text-sm text-[#666F94]">
            Müşteri taleplerini onaylayın. Manuel yükleme ile kendinize veya herhangi bir kullanıcıya bakiye ekleyin.
            Destek talepleri burada görünmez —{' '}
            <a href="/admin/destek" className="font-bold text-[#7844E4]">Destek</a> sayfasına bakın.
          </p>
        </div>
        {pendingCount > 0 && (
          <span className="rounded-full bg-[#FD5501] px-4 py-1.5 text-sm font-bold text-white">
            {pendingCount} bekleyen talep
          </span>
        )}
      </div>

      {msg && (
        <p className={`mb-4 rounded-xl p-3 text-sm ${msg.includes('onay') || msg.includes('eklendi') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {msg}
        </p>
      )}

      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-bold text-[#33353E]">Bekleyen Yükleme Talepleri</h2>
        {pending.length === 0 ? (
          <p className="mt-3 text-sm text-[#666F94]">Bekleyen talep yok.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {pending.map((d) => (
              <div key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E9EBF5] p-4">
                <div>
                  <p className="font-bold text-[#33353E]">{d.user.email}</p>
                  <p className="text-sm text-[#666F94]">
                    {d.amount.toFixed(2)} ₺ · {d.method.toUpperCase()}
                    {d.reference ? ` · Ref: ${d.reference}` : ''}
                  </p>
                  <p className="text-xs text-[#666F94]">Mevcut bakiye: {d.user.balance.toFixed(2)} ₺ · {new Date(d.createdAt).toLocaleString('tr-TR')}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={loading === d.id}
                    onClick={() => review(d.id, 'approve')}
                    className="rounded-xl bg-[#10B981] px-4 py-2 text-sm font-bold text-white hover:bg-[#0d9668] disabled:opacity-60"
                  >
                    Onayla & Yükle
                  </button>
                  <button
                    type="button"
                    disabled={loading === d.id}
                    onClick={() => review(d.id, 'reject')}
                    className="rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    Reddet
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-bold">Bakiye Ata</h2>
        <p className="mt-1 text-xs text-[#666F94]">
          Girilen tutar <strong>yeni bakiye</strong> olur — mevcut bakiyenin üzerine eklenmez. Sıfırlamak için 0 yazın.
        </p>
        <form onSubmit={setUserBalance} className="mt-4 flex flex-wrap gap-2">
          <select value={manualUser} onChange={(e) => {
            setManualUser(e.target.value)
            const u = users.find((x) => x.id === e.target.value)
            if (u) setManualAmount(String(Math.round(u.balance)))
          }} className="min-w-[200px] flex-1 rounded-xl border border-[#E9EBF5] px-3 py-2 text-sm" required>
            <option value="">Kullanıcı seç</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.email} (şu an: {u.balance.toFixed(2)} ₺){u.role === 'admin' ? ' [Admin]' : ''}
              </option>
            ))}
          </select>
          <input type="number" min={0} step={0.01} value={manualAmount} onChange={(e) => setManualAmount(e.target.value)} className="w-32 rounded-xl border px-3 py-2 text-sm" placeholder="Yeni ₺" />
          <input type="text" value={manualNote} onChange={(e) => setManualNote(e.target.value)} placeholder="Not (opsiyonel)" className="min-w-[140px] flex-1 rounded-xl border px-3 py-2 text-sm" />
          <button type="submit" className="rounded-xl bg-[#7844E4] px-4 py-2 text-sm font-bold text-white">Bakiye Ata</button>
        </form>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-bold">Talep Geçmişi</h2>
          <ul className="mt-3 max-h-80 space-y-2 overflow-y-auto text-sm">
            {history.map((d) => (
              <li key={d.id} className="flex justify-between border-b border-[#E9EBF5] py-2">
                <span>{d.user.email} · {d.amount.toFixed(0)} ₺</span>
                <span className={`text-xs font-bold ${d.status === 'approved' ? 'text-green-600' : d.status === 'rejected' ? 'text-red-600' : 'text-amber-600'}`}>
                  {d.status}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-bold">Son Bakiye İşlemleri</h2>
          <ul className="mt-3 max-h-80 space-y-2 overflow-y-auto text-sm">
            {transactions.map((t) => (
              <li key={t.id} className="flex justify-between border-b border-[#E9EBF5] py-2">
                <span className="truncate text-[#666F94]">{t.user.email}</span>
                <span className={`font-bold ${t.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {t.amount >= 0 ? '+' : ''}{t.amount.toFixed(2)} ₺
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
