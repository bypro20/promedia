'use client'

import Link from 'next/link'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { IyzicoCheckout } from '@/components/iyzico-checkout'
import { LegalConsentNote } from '@/components/legal/legal-consent-note'
import { PaymentTrustBar } from '@/components/payment-trust-bar'
import { BANK_ACCOUNTS, paymentReference } from '@/lib/site-config'

type Tx = { id: string; type: string; amount: number; note: string | null; createdAt: string }
type Deposit = {
  id: string
  amount: number
  method: string
  reference: string | null
  grossAmount?: number | null
  commissionAmount?: number | null
  status: string
  adminNote: string | null
  createdAt: string
}

type IyzicoConfig = {
  enabled: boolean
  rate: number
  rateLabel: string
  fixed: number
}

const METHODS = [
  { id: 'havale', label: 'Havale / EFT' },
  { id: 'eft', label: 'Banka EFT' },
] as const

const STATUS_LABEL: Record<string, string> = {
  pending: 'Onay bekliyor',
  approved: 'Onaylandı',
  rejected: 'Reddedildi',
}

function calcBreakdown(net: number, rate: number, fixed: number) {
  const n = Math.max(0, net)
  const gross = Math.ceil(((n + fixed) / (1 - rate)) * 100) / 100
  const commission = Math.round((gross - n) * 100) / 100
  return { net: n, gross, commission }
}

export default function PanelBalancePage() {
  return (
    <Suspense fallback={<main className="p-8 text-sm text-[#666F94]">Yükleniyor…</main>}>
      <PanelBalanceContent />
    </Suspense>
  )
}

function PanelBalanceContent() {
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<'card' | 'bank'>('card')
  const [balance, setBalance] = useState(0)
  const [txs, setTxs] = useState<Tx[]>([])
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [pending, setPending] = useState<Deposit | null>(null)
  const [amount, setAmount] = useState('100')
  const [method, setMethod] = useState<'havale' | 'eft'>('havale')
  const [reference, setReference] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [iyzicoConfig, setIyzicoConfig] = useState<IyzicoConfig | null>(null)
  const [checkout, setCheckout] = useState<{ content: string; gross: number } | null>(null)

  const cardActive = iyzicoConfig?.enabled ?? false

  const breakdown = useMemo(() => {
    const net = Number(amount) || 0
    const rate = iyzicoConfig?.rate ?? 0.0299
    const fixed = iyzicoConfig?.fixed ?? 0.25
    return calcBreakdown(net, rate, fixed)
  }, [amount, iyzicoConfig])

  const load = useCallback(() => {
    void fetch('/api/panel/balance').then((r) => r.json()).then((d) => {
      if (d.ok) {
        setBalance(d.balance)
        setTxs(d.transactions)
        setDeposits(d.deposits)
        setPending(d.pendingDeposit)
        setUserId(d.userId ?? '')
        setUserEmail(d.userEmail ?? '')
      }
    })
  }, [])

  useEffect(() => {
    load()
    void fetch('/api/iyzico/status').then((r) => r.json()).then((d) => {
      if (d.enabled) {
        setIyzicoConfig({
          enabled: true,
          rate: d.rate,
          rateLabel: d.rateLabel,
          fixed: d.fixed,
        })
        setTab('card')
      } else {
        setIyzicoConfig({ enabled: false, rate: 0.0299, rateLabel: '', fixed: 0.25 })
        setTab('bank')
      }
    })
  }, [load])

  useEffect(() => {
    const payment = searchParams.get('payment')
    if (payment === 'success') {
      setMsg('Ödeme alındı — bakiyeniz birkaç saniye içinde güncellenir.')
      load()
    } else if (payment === 'failed') {
      setMsg('Kart ödemesi tamamlanamadı. Tekrar deneyebilirsiniz.')
    }
  }, [searchParams, load])

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

  async function startIyzico(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    setLoading(true)
    const res = await fetch('/api/iyzico/deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(amount) }),
    })
    const d = await res.json()
    setLoading(false)
    if (!d.ok) {
      setMsg(d.error)
      return
    }
    if (d.checkoutFormContent) {
      setCheckout({ content: d.checkoutFormContent, gross: d.gross })
    } else {
      setMsg('Ödeme formu oluşturulamadı')
    }
  }

  return (
    <main className="p-4 lg:p-8">
      {checkout && (
        <IyzicoCheckout
          checkoutFormContent={checkout.content}
          gross={checkout.gross}
          packageLabel="Bakiye Yükleme"
          onClose={() => {
            setCheckout(null)
            load()
          }}
        />
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#33353E]">Bakiye Yükle</h1>
        <p className="mt-1 text-sm text-[#666F94]">
          {cardActive
            ? 'Kredi kartı ile anında yükleyin veya havale / EFT ile talep oluşturun.'
            : 'Şimdilik havale / EFT ile yükleyin; bakiye panelinizde birikir.'}
        </p>
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
          <div className="flex gap-2 border-b border-[#E9EBF5] pb-4">
            <button
              type="button"
              onClick={() => setTab('card')}
              className={`rounded-xl px-4 py-2 text-sm font-bold ${tab === 'card' ? 'bg-[#7844E4] text-white' : 'text-[#666F94] hover:bg-[#F0F1F9]'}`}
            >
              💳 Kredi / Banka Kartı
            </button>
            <button
              type="button"
              onClick={() => setTab('bank')}
              className={`rounded-xl px-4 py-2 text-sm font-bold ${tab === 'bank' ? 'bg-[#7844E4] text-white' : 'text-[#666F94] hover:bg-[#F0F1F9]'}`}
            >
              🏦 Havale / EFT
            </button>
          </div>

          {tab === 'card' ? (
            <div className="mt-4">
              {!cardActive ? (
                <div className="rounded-xl border border-[#E4DAFA] bg-[#F6F2FF] p-4 text-sm text-[#33353E]">
                  <p className="font-bold text-[#7844E4]">Kart ödemesi yapılandırılıyor</p>
                  <p className="mt-1 text-[#666F94]">
                    Kısa süre içinde iyzico ile anında yükleme açılacak. Şimdilik{' '}
                    <button type="button" onClick={() => setTab('bank')} className="font-bold text-[#7844E4] underline">
                      Havale / EFT
                    </button>{' '}
                    sekmesini kullanın.
                  </p>
                </div>
              ) : (
                <form onSubmit={startIyzico}>
                  <p className="text-sm text-[#666F94]">
                    Bakiyenize yansıyacak tutarı girin. iyzico komisyonu ({iyzicoConfig?.rateLabel}
                    {iyzicoConfig?.fixed ? ` + ₺${iyzicoConfig.fixed.toFixed(2)}` : ''}) ödeme tutarına eklenir.
                  </p>
                  <div className="mt-4">
                    <label className="block text-xs font-semibold text-[#666F94]">Bakiyeye eklenecek tutar (₺)</label>
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
                  <div className="mt-4 rounded-xl border border-[#E9EBF5] bg-[#FBFDFF] p-4 text-sm">
                    <div className="flex justify-between py-1">
                      <span className="text-[#666F94]">Bakiyenize geçecek</span>
                      <span className="font-bold text-[#33353E]">{breakdown.net.toFixed(2)} ₺</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#666F94]">iyzico komisyonu</span>
                      <span className="font-semibold text-[#FD5501]">+{breakdown.commission.toFixed(2)} ₺</span>
                    </div>
                    <div className="mt-2 flex justify-between border-t border-[#E9EBF5] pt-2">
                      <span className="font-bold text-[#33353E]">Karttan çekilecek</span>
                      <span className="text-lg font-black text-[#7844E4]">{breakdown.gross.toFixed(2)} ₺</span>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading || Number(amount) < 10}
                    className="mt-4 w-full rounded-xl bg-[#7844E4] py-3 text-sm font-bold text-white hover:bg-[#6835d3] disabled:opacity-60"
                  >
                    {loading ? 'Yönlendiriliyor…' : `${breakdown.gross.toFixed(2)} ₺ Öde — Anında Yükle`}
                  </button>
                  <div className="mt-4 space-y-3">
                    <PaymentTrustBar variant="light" showLinks={false} />
                    <LegalConsentNote />
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="mt-4">
              <h2 className="font-bold text-[#33353E]">Ödeme Bilgileri</h2>
              <p className="mt-1 text-xs text-[#666F94]">Transfer yaptıktan sonra talep oluşturun — admin onayı gerekir (komisyon yok).</p>
              <div className="mt-4 space-y-3">
                {BANK_ACCOUNTS.map((acc) => (
                  <div key={acc.bank} className="rounded-xl border border-[#E9EBF5] bg-[#F0F1F9] p-4 text-sm">
                    <p className="font-bold text-[#33353E]">{acc.bank}</p>
                    <p className="text-[#666F94]">{acc.holder} · {acc.branch}</p>
                    <p className="mt-1 font-mono text-xs font-bold text-[#7844E4]">{acc.iban}</p>
                  </div>
                ))}
              </div>
              {userId && (
                <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
                  <strong>Açıklama:</strong> Havale açıklamasına{' '}
                  <code className="font-mono font-bold">{paymentReference(userId, userEmail)}</code> yazın.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {tab === 'bank' && (
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          {pending && !['paytr', 'iyzico'].includes(pending.method) ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="font-bold text-amber-800">Bekleyen talep: {pending.amount.toFixed(2)} ₺</p>
              <p className="mt-1 text-sm text-amber-700">
                {STATUS_LABEL[pending.status]} · {pending.method.toUpperCase()}
              </p>
            </div>
          ) : (
            <form onSubmit={requestDeposit}>
              <h2 className="font-bold text-[#33353E]">Yükleme Talebi Oluştur</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[#666F94]">Tutar (₺)</label>
                  <input
                    type="number"
                    min={10}
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
                <label className="block text-xs font-semibold text-[#666F94]">Dekont / referans no</label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
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
            </form>
          )}
        </div>
      )}

      {msg && (
        <p className={`mt-4 rounded-xl p-3 text-sm ${msg.includes('başarı') || msg.includes('alındı') || msg.includes('güncellen') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {msg}
        </p>
      )}

      {deposits.length > 0 && (
        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-bold">Yükleme Taleplerim</h2>
          <ul className="mt-3 divide-y divide-[#E9EBF5] text-sm">
            {deposits.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <span className="font-semibold">
                  +{d.amount.toFixed(2)} ₺
                  {['paytr', 'iyzico'].includes(d.method) && d.grossAmount ? (
                    <span className="ml-1 text-xs font-normal text-[#666F94]">
                      (ödenen {d.grossAmount.toFixed(2)} ₺, komisyon {d.commissionAmount?.toFixed(2)} ₺)
                    </span>
                  ) : null}
                  {' · '}{d.method}
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  d.status === 'approved' ? 'bg-green-100 text-green-700'
                    : d.status === 'rejected' ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-700'
                }`}>
                  {STATUS_LABEL[d.status] ?? d.status}
                </span>
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
