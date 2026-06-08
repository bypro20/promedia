'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { STATUS_LABELS } from '@/lib/smm/status-labels'
import { formatPrice } from '@/lib/format'

type Order = {
  code: string
  status: string
  smmStatus?: string | null
  serviceTitle: string
  amount: number
  unit: string
  price: number
  target: string
  smmRemains?: number | null
  smmStartCount?: number | null
  smmOrderId?: string | null
  refillId?: string | null
  refillStatus?: string | null
  errorMessage?: string | null
  createdAt: string
  updatedAt: string
}

export default function PanelOrderDetailPage() {
  const params = useParams()
  const code = String(params.code ?? '')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  function load() {
    void fetch(`/api/panel/orders/${encodeURIComponent(code)}`)
      .then((r) => r.json())
      .then((d) => { if (d.ok) setOrder(d.order); setLoading(false) })
  }

  useEffect(() => { load() }, [code])

  async function refresh() {
    setRefreshing(true)
    const res = await fetch(`/api/panel/orders/${encodeURIComponent(code)}`, { method: 'POST' })
    const d = await res.json()
    if (d.ok) setOrder(d.order)
    setRefreshing(false)
  }

  if (loading) return <main className="p-8 text-sm text-[#666F94]">Yükleniyor…</main>
  if (!order) {
    return (
      <main className="p-8">
        <p>Sipariş bulunamadı.</p>
        <Link href="/panel/siparisler" className="text-[#7844E4] font-bold">← Siparişlerim</Link>
      </main>
    )
  }

  return (
    <main className="p-6 lg:p-8">
      <Link href="/panel/siparisler" className="text-sm font-semibold text-[#7844E4] hover:underline">← Siparişlerim</Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black font-mono text-[#7844E4]">{order.code}</h1>
          <p className="mt-1 font-semibold text-[#33353E]">{order.serviceTitle}</p>
        </div>
        <span className="rounded-full bg-[#EDE5FF] px-4 py-1.5 text-sm font-bold text-[#7844E4]">
          {STATUS_LABELS[order.status] ?? order.status}
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase text-[#666F94]">Miktar</p>
          <p className="text-lg font-black">{order.amount.toLocaleString('tr-TR')} {order.unit}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase text-[#666F94]">Tutar</p>
          <p className="text-lg font-black">{formatPrice(order.price)} ₺</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase text-[#666F94]">SMM Durumu</p>
          <p className="text-sm font-bold">{order.smmStatus ?? '—'}</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm text-sm">
        <p className="text-xs font-bold uppercase text-[#666F94]">Hedef link</p>
        <a href={order.target} target="_blank" rel="noopener noreferrer" className="mt-1 block break-all text-[#7844E4] hover:underline">{order.target}</a>
        {order.smmStartCount != null && <p className="mt-3 text-[#666F94]">Başlangıç: {order.smmStartCount.toLocaleString('tr-TR')}</p>}
        {order.smmRemains != null && <p className="text-[#666F94]">Kalan: {order.smmRemains.toLocaleString('tr-TR')}</p>}
        {order.errorMessage && <p className="mt-2 text-red-600">{order.errorMessage}</p>}
        <p className="mt-3 text-xs text-[#666F94]">
          Oluşturulma: {new Date(order.createdAt).toLocaleString('tr-TR')} · Güncelleme: {new Date(order.updatedAt).toLocaleString('tr-TR')}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={refresh} disabled={refreshing} className="rounded-xl bg-[#7844E4] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
          {refreshing ? 'Yenileniyor…' : 'Durumu Yenile'}
        </button>
        <Link href={`/panel/telafi?code=${order.code}`} className="rounded-xl border border-[#7844E4] px-4 py-2 text-sm font-bold text-[#7844E4]">
          Telafi Talebi
        </Link>
      </div>
    </main>
  )
}
