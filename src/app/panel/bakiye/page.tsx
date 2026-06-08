'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Tx = { id: string; type: string; amount: number; note: string | null; createdAt: string }
type Deposit = {
  id: string
  amount: number
  method: string
  reference: string | null
  status: string
  adminNote: string | null
  createdAt: string
}

const METHODS = [
  { id: 'havale', label: 'Havale / EFT' },
  { id: 'papara', label: 'Papara' },
  { id: 'eft', label: 'Banka EFT' },
] as const

const STATUS_LABEL: Record<string, string> = {
  pending: 'Onay bekliyor',
  approved: 'Onaylandı',
  rejected: 'Reddedildi',
}

export default function PanelBalancePage() {
  const [balance, setBalance] = useState(0)
  const [txs, setTxs] = useState<Tx[]>([])
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [pending, setPending] = useState<Deposit | null>(null)
  const [amount, setAmount] = useState('100')
  const [method, setMethod] = useState<'havale' | 'papara' | 'eft'>('havale')
  const [reference, setReference] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function load() {
    void fetch('/api/panel/balance').then((r) => r.json()).then((d) => {
      if (d.ok) {
        setBalance(d.balance)
        setTxs(d.transactions)
        setDeposits(d.deposits)
        setPending(d.pendingDeposit)
      }
    })
  }

  useEffect(() => { load() }, [])

  async function requestDeposit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    setLoading(true)
    const res = await fetch('/api/panel/balance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(amount), method, reference }),
    })
    const d = await res.json()
    setMsg(d.ok ? d.message : d.error)
    setLoading(false)
    if (d.ok) load()
  }

  return (
    <main className="p-4 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#33353E]">Bakiye Yükle</h1>
        <p className="mt-1 text-sm text-[#666F94]">Ödeme yaptıktan sonra talep oluşturun — admin onayından sonra bakiyenize yansır.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-[#7844E4] to-[#5a2eb8] p-6 text-white shadow-lg lg:col-span-1">
          <p className="text-xs font-bold uppercase tracking-wider text-white/70">Mevcut Bakiye</p>
          <p className="mt-2 text-4xl font-black">{balance.toFixed(2)} ₺</p>
          <Link href="/hizmetler" className="mt-6 inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#7844E4] hover:bg-white/90">
            Sipariş Ver →
          </Link>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
          {pending ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="font-bold text-amber-800">Bekleyen talep: {pending.amount.toFixed(2)} ₺</p>
              <p className="mt-1 text-sm text-amber-700">
                {STATUS_LABEL[pending.status]} · {pending.method.toUpperCase()}
                {pending.reference ? ` · Ref: ${pending.reference}` : ''}
              </p>
              <p className="mt-2 text-xs text-amber-600">Admin onayı bekleniyor. Yeni talep gönderemezsiniz.</p>
            </div>
          ) : (
            <form onSubmit={requestDeposit}>
              <h2 className="font-bold text-[#33353E]">Yükleme Talebi Oluştur</h2>
              <p className="mt-1 text-xs text-[#666F94]">MedyaBayim, SosyalBayin gibi panellerde olduğu gibi önce ödeme yapın, sonra talep gönderin.</p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[#666F94]">Tutar (₺)</label>
                  <input
                    type="number"
                    min={10}
                    step={1}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E9EBF5] px-3 py-2.5 text-sm outline-none focus:border-[#7844E4]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#666F94]">Ödeme yöntemi</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as typeof method)}
                    className="mt-1 w-full rounded-xl border border-[#E9EBF5] px-3 py-2.5 text-sm outline-none focus:border-[#7844E4]"
                  >
                    {METHODS.map((m) => (
                      <option key={m.id} value={m.id}>{m.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-semibold text-[#666F94]">Dekont / referans no (opsiyonel)</label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Havale açıklaması veya dekont no"
                  className="mt-1 w-full rounded-xl border border-[#E9EBF5] px-3 py-2.5 text-sm outline-none focus:border-[#7844E4]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full rounded-xl bg-[#7844E4] py-3 text-sm font-bold text-white hover:bg-[#6835d3] disabled:opacity-60"
              >
                {loading ? 'Gönderiliyor…' : 'Yükleme Talebi Gönder'}
              </button>
              {msg && <p className={`mt-3 text-sm ${msg.includes('alındı') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
            </form>
          )}
        </div>
      </div>

      {deposits.length > 0 && (
        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-bold">Yükleme Taleplerim</h2>
          <ul className="mt-3 divide-y divide-[#E9EBF5] text-sm">
            {deposits.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <span className="font-semibold">{d.amount.toFixed(2)} ₺ · {d.method}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  d.status === 'approved' ? 'bg-green-100 text-green-700'
                    : d.status === 'rejected' ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-700'
                }`}>
                  {STATUS_LABEL[d.status] ?? d.status}
                </span>
                <span className="text-xs text-[#666F94]">{new Date(d.createdAt).toLocaleString('tr-TR')}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-bold">İşlem Geçmişi</h2>
        {txs.length === 0 ? (
          <p className="mt-3 text-sm text-[#666F94]">Henüz işlem yok.</p>
        ) : (
          <ul className="mt-3 divide-y divide-[#E9EBF5] text-sm">
            {txs.map((t) => (
              <li key={t.id} className="flex justify-between py-3">
                <span className="text-[#666F94]">{t.note ?? t.type}</span>
                <span className={`font-bold ${t.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {t.amount >= 0 ? '+' : ''}{t.amount.toFixed(2)} ₺
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
