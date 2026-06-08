'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { STATUS_LABELS } from '@/lib/smm/status-labels'
import { formatAmount, formatPrice } from '@/lib/format'

type OrderData = {
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
  errorMessage?: string | null
  createdAt: string
}

function OrderLookupForm() {
  const searchParams = useSearchParams()
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<OrderData | null>(null)

  useEffect(() => {
    const q = searchParams.get('code')
    if (q) setCode(q)
  }, [searchParams])

  async function lookup(orderCode: string, orderEmail: string) {
    setLoading(true)
    setError(null)
    setOrder(null)
    try {
      const params = new URLSearchParams({ code: orderCode.trim() })
      if (orderEmail.trim()) params.set('email', orderEmail.trim())
      const res = await fetch(`/api/orders?${params}`)
      const data = await res.json()
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? 'Sipariş bulunamadı')
      }
      setOrder(data.order)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sorgulama başarısız')
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    void lookup(code, email)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium">
            Sipariş kodu
          </label>
          <input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="PM-123456"
            className="mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Sipariş e-postası
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="siparis@example.com"
            className="mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            required
          />
          <p className="mt-1 text-xs text-muted">Güvenlik için siparişte kullandığınız e-posta gerekli.</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent py-3 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-60"
        >
          {loading ? 'Sorgulanıyor…' : 'Sorgula'}
        </button>
      </form>

      {error && (
        <p className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>
      )}

      {order && (
        <div className="mt-6 space-y-3 rounded-lg border border-border bg-card p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#33353E]">{order.code}</span>
            <span className="rounded-full bg-[#EDE5FF] px-3 py-1 text-xs font-bold text-[#7844E4]">
              {STATUS_LABELS[order.status] ?? order.status}
            </span>
          </div>
          <p className="font-semibold text-[#33353E]">{order.serviceTitle}</p>
          <p className="text-muted">
            {formatAmount(order.amount)} {order.unit} · {formatPrice(order.price)} ₺
          </p>
          <p className="text-muted break-all">Hedef: {order.target}</p>
          {order.smmStatus && <p className="text-muted">SMM: {order.smmStatus}</p>}
          {order.smmStartCount != null && <p className="text-muted">Başlangıç: {order.smmStartCount}</p>}
          {order.smmRemains != null && <p className="text-muted">Kalan: {order.smmRemains}</p>}
          {order.errorMessage && <p className="text-red-600">{order.errorMessage}</p>}
          <Link href="/telafi-talebi" className="inline-block text-sm font-semibold text-accent hover:underline">
            Telafi talebi oluştur →
          </Link>
        </div>
      )}
    </>
  )
}

export default function OrderLookupPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Sipariş Sorgula</h1>
      <p className="mt-2 text-sm text-muted">
        Sipariş kodunuzu girerek durumunu kontrol edin.
      </p>

      <Suspense fallback={<p className="mt-8 text-sm text-muted">Yükleniyor…</p>}>
        <OrderLookupForm />
      </Suspense>
    </main>
  )
}
