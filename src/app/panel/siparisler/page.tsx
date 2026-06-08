'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { STATUS_LABELS } from '@/lib/smm/status-labels'
import { formatPrice } from '@/lib/format'

type Order = {
  id: string
  code: string
  status: string
  serviceSlug: string
  amount: number
  price: number
  createdAt: string
}

export default function PanelOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    void fetch('/api/panel/orders').then((r) => r.json()).then((d) => { if (d.ok) setOrders(d.orders) })
  }, [])

  const filtered = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false
    if (!search.trim()) return true
    return o.code.toLowerCase().includes(search.toLowerCase())
      || o.serviceSlug.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <main className="p-6 lg:p-8">
      <h1 className="text-2xl font-black">Siparişlerim</h1>

      <div className="mt-4 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Sipariş kodu ara..."
          className="rounded-xl border px-3 py-2 text-sm"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border px-3 py-2 text-sm">
          <option value="all">Tümü</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-4 text-[#666F94]">Sipariş yok. <Link href="/hizmetler" className="text-[#7844E4] font-bold">Hizmetlere git</Link></p>
      ) : (
        <div className="mt-6 space-y-3">
          {filtered.map((o) => (
            <Link key={o.id} href={`/panel/siparisler/${o.code}`} className="block rounded-2xl bg-white p-4 shadow-sm hover:ring-2 hover:ring-[#7844E4]/20">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono font-bold text-[#7844E4]">{o.code}</span>
                <span className="rounded-full bg-[#EDE5FF] px-3 py-1 text-xs font-bold">{STATUS_LABELS[o.status] ?? o.status}</span>
              </div>
              <p className="mt-2 font-semibold">{o.serviceSlug}</p>
              <p className="text-sm text-[#666F94]">{o.amount.toLocaleString('tr-TR')} adet · {formatPrice(o.price)} ₺</p>
              <p className="mt-1 text-xs text-[#666F94]">{new Date(o.createdAt).toLocaleString('tr-TR')}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
