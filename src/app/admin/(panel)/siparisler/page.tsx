'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { STATUS_LABELS } from '@/lib/smm/status-labels'

type Order = {
  id: string
  code: string
  status: string
  price: number
  serviceSlug: string
  user?: { email: string } | null
  email: string | null
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  function load() {
    void fetch('/api/admin/orders').then((r) => r.json()).then((d) => { if (d.ok) setOrders(d.orders) })
  }

  useEffect(() => { load() }, [])

  async function action(code: string, act: string) {
    if (!confirm(`${act} işlemi onaylıyor musunuz?`)) return
    await fetch('/api/admin/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, action: act }),
    })
    load()
  }

  const filtered = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false
    if (!filter.trim()) return true
    const q = filter.toLowerCase()
    return o.code.toLowerCase().includes(q)
      || o.serviceSlug.toLowerCase().includes(q)
      || (o.user?.email ?? o.email ?? '').toLowerCase().includes(q)
  })

  return (
    <main className="p-6 lg:p-8">
      <h1 className="text-2xl font-black">Siparişler</h1>

      <div className="mt-4 flex flex-wrap gap-3">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Kod, e-posta veya hizmet ara..."
          className="rounded-xl border px-3 py-2 text-sm"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border px-3 py-2 text-sm">
          <option value="all">Tüm durumlar</option>
          {Object.keys(STATUS_LABELS).map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm text-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-xs text-[#666F94]">
              <th className="p-3">Kod</th>
              <th className="p-3">Kullanıcı</th>
              <th className="p-3">Hizmet</th>
              <th className="p-3">Durum</th>
              <th className="p-3">Tutar</th>
              <th className="p-3">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b">
                <td className="p-3 font-mono text-xs">{o.code}</td>
                <td className="p-3">{o.user?.email ?? o.email ?? 'Misafir'}</td>
                <td className="p-3 max-w-[180px] truncate">{o.serviceSlug}</td>
                <td className="p-3">{STATUS_LABELS[o.status] ?? o.status}</td>
                <td className="p-3">{o.price.toFixed(2)} ₺</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    <button type="button" onClick={() => action(o.code, 'refresh')} className="text-xs font-bold text-[#7844E4]">Yenile</button>
                    {!['cancelled', 'refunded', 'completed'].includes(o.status) && (
                      <button type="button" onClick={() => action(o.code, 'cancel')} className="text-xs font-bold text-amber-600">İptal</button>
                    )}
                    {o.user && !['refunded'].includes(o.status) && (
                      <button type="button" onClick={() => action(o.code, 'refund')} className="text-xs font-bold text-red-600">İade</button>
                    )}
                    {['failed', 'cancelled'].includes(o.status) && (
                      <button type="button" onClick={() => action(o.code, 'resubmit')} className="text-xs font-bold text-green-600">Yeniden Gönder</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
