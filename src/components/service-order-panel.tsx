'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { ServiceDefinition, PackageTier } from '@/lib/packages'
import { getDefaultPackageId } from '@/lib/packages'
import { formatAmount, formatPrice } from '@/lib/format'
import { TIER_COLORS } from '@/lib/platform-colors'
import { getAudienceBadgeColor } from '@/lib/catalog'
import { STATUS_LABELS } from '@/lib/smm/status-labels'
import { addToCart } from '@/lib/cart'
import { IyzicoCheckout } from '@/components/iyzico-checkout'
import { LegalConsentNote } from '@/components/legal/legal-consent-note'
import { PaymentTrustBar } from '@/components/payment-trust-bar'
import { grossFromNet } from '@/lib/iyzico-commission'

type Props = { service: ServiceDefinition }

type OrderResult = {
  code: string
  status: string
  errorMessage?: string | null
}

export function ServiceOrderPanel({ service }: Props) {
  const color = service.platformColor
  const [tierId, setTierId] = useState<PackageTier>(service.defaultTier)
  const [selectedPkgId, setSelectedPkgId] = useState(() =>
    getDefaultPackageId(service.tiers, service.defaultTier)
  )
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<OrderResult | null>(null)
  const [session, setSession] = useState<{ balance: number } | null>(null)
  const [iyzicoEnabled, setIyzicoEnabled] = useState(false)
  const [checkout, setCheckout] = useState<{
    checkoutFormContent: string
    gross: number
    orderCode: string
  } | null>(null)

  useEffect(() => {
    void fetch('/api/auth').then((r) => r.json()).then((d) => {
      if (d.ok) setSession(d.user)
    })
    void fetch('/api/iyzico/status')
      .then((r) => (r.ok ? r.json() : { enabled: false }))
      .then((d) => setIyzicoEnabled(Boolean(d.enabled)))
      .catch(() => setIyzicoEnabled(false))
  }, [])

  const tier = service.tiers.find((t) => t.id === tierId)!
  const selected = tier.packages.find((p) => p.id === selectedPkgId) ?? tier.packages[0]
  const tierColor = TIER_COLORS[tierId]?.active ?? color
  const audienceColor = getAudienceBadgeColor(service.audience)

  function selectTier(id: PackageTier) {
    setTierId(id)
    setSelectedPkgId(getDefaultPackageId(service.tiers, id))
    setResult(null)
    setError(null)
  }

  const priceBreakdown = grossFromNet(selected.price)

  async function handleIyzicoCheckout() {
    if (!username.trim() || loading) return
    if (!email.trim()) {
      setError('Ödeme için e-posta adresi zorunludur.')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/iyzico/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceSlug: service.slug,
          tierId,
          packageId: selectedPkgId,
          target: username.trim(),
          email: email.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? 'Ödeme başlatılamadı')
      }
      if (data.checkoutFormContent) {
        setCheckout({
          checkoutFormContent: data.checkoutFormContent,
          gross: data.gross,
          orderCode: data.orderCode,
        })
      } else if (data.paymentPageUrl) {
        window.location.href = data.paymentPageUrl
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!username.trim() || loading) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceSlug: service.slug,
          tierId,
          packageId: selectedPkgId,
          target: username.trim(),
          email: email.trim() || undefined,
          payFromBalance: Boolean(session),
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? 'Sipariş oluşturulamadı')
      }

      setResult({
        code: data.order.code,
        status: data.order.status,
        errorMessage: data.order.errorMessage,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15)]" style={{ backgroundColor: '#282D40' }}>
      <div className="flex overflow-x-auto scrollbar-hide border-b border-white/10 scroll-pl-4 scroll-pr-4">
        {service.tiers.map((t) => {
          const tc = TIER_COLORS[t.id]
          const active = tierId === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => selectTier(t.id)}
              className={`relative shrink-0 px-4 py-3 text-xs font-bold transition-all sm:px-6 sm:text-sm ${
                active ? 'rounded-t-xl bg-white text-[#2A303C]' : 'text-white/75 hover:text-white'
              }`}
            >
              {!active && (
                <span
                  className="absolute bottom-0 left-0 h-0.5 w-full opacity-60"
                  style={{ backgroundColor: tc?.active }}
                />
              )}
              <span className="block max-w-[88px] truncate sm:max-w-none">{t.shortName}</span>
              {t.badge && (
                <span
                  className="mt-0.5 inline-block max-w-full truncate rounded px-1.5 py-0.5 text-[9px] font-black uppercase text-white sm:ml-1.5 sm:mt-0"
                  style={{ backgroundColor: active ? tc?.active : '#FD5501' }}
                >
                  {t.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="grid gap-6 bg-white p-5 lg:grid-cols-[1fr_320px] lg:p-6">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span
              className="shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase text-white"
              style={{ backgroundColor: audienceColor }}
            >
              {service.audience === 'ucuz' ? 'Ucuz Global' : service.audience === 'turk' ? 'Türk' : 'Global'}
            </span>
            <span
              className="shrink-0 rounded-full px-3 py-1 text-xs font-bold text-white"
              style={{ backgroundColor: color }}
            >
              {service.platform}
            </span>
            <span className="min-w-0 text-sm font-semibold leading-snug text-[#666F94]">{tier.description}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {tier.packages.map((pkg) => {
              const active = selectedPkgId === pkg.id
              const topLabel = pkg.popular
                ? 'Çok Satan'
                : pkg.cheap
                  ? 'Ucuz'
                  : pkg.bonus
                    ? 'Bonus!'
                    : pkg.savings
                      ? `%${pkg.savings} KAR`
                      : null
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => {
                    setSelectedPkgId(pkg.id)
                    setResult(null)
                  }}
                  className={`relative flex min-h-[92px] flex-col items-center justify-end gap-0.5 rounded-xl border-2 px-1 pb-2.5 pt-7 transition-all ${
                    active ? 'scale-[1.03] text-white shadow-lg' : 'border-[#E9EBF5] bg-white hover:shadow-md'
                  }`}
                  style={
                    active
                      ? { backgroundColor: tierColor, borderColor: tierColor }
                      : { borderColor: '#E9EBF5' }
                  }
                >
                  {topLabel && (
                    <span
                      className="absolute top-1 left-1/2 z-10 max-w-[calc(100%-6px)] -translate-x-1/2 truncate rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase text-white"
                      style={{ backgroundColor: pkg.popular || pkg.bonus ? color : pkg.cheap ? '#10B981' : '#FD5501' }}
                    >
                      {topLabel}
                    </span>
                  )}
                  <span className="text-base font-black leading-none">{formatAmount(pkg.amount)}</span>
                  <span className={`text-[11px] font-bold whitespace-nowrap ${active ? 'text-white/90' : 'text-[#666F94]'}`}>
                    {formatPrice(pkg.price)} ₺
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-5 rounded-xl p-4" style={{ backgroundColor: service.platformColorLight }}>
            <p className="text-sm font-bold" style={{ color: tierColor }}>{tier.name}</p>
            <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
              {tier.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm font-medium text-[#33353E]">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-white" style={{ backgroundColor: '#10B981' }}>
                    <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border-2 bg-[#FBFDFF] p-5" style={{ borderColor: service.platformColorLight }}>
          {result ? (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#10B981]/15 text-2xl">
                {result.status === 'failed' ? '⚠️' : result.status === 'awaiting_panel_balance' ? '⏳' : '✓'}
              </div>
              <p className="mt-3 text-lg font-black text-[#33353E]">
                {result.status === 'failed'
                  ? 'Sipariş Hatası'
                  : result.status === 'awaiting_panel_balance'
                    ? 'Sipariş Alındı — İşleme Hazır'
                    : 'Sipariş Alındı!'}
              </p>
              <p className="mt-1 text-sm font-bold text-[#7844E4]">{result.code}</p>
              <p className="mt-2 text-sm text-[#666F94]">
                Durum: {STATUS_LABELS[result.status] ?? result.status}
              </p>
              {result.errorMessage && (
                <p className="mt-2 rounded-lg bg-red-50 p-2 text-xs text-red-600">{result.errorMessage}</p>
              )}
              <Link
                href={`/siparis-sorgula?code=${encodeURIComponent(result.code)}`}
                className="mt-4 inline-block w-full rounded-2xl py-3 text-sm font-black text-white"
                style={{ backgroundColor: tierColor }}
              >
                Siparişi Takip Et
              </Link>
              {!session && (
                <Link href="/kayit" className="mt-2 inline-block w-full rounded-2xl border-2 py-3 text-sm font-black text-[#7844E4]">
                  Kayıt Ol — Siparişlerinizi Panelden Yönetin
                </Link>
              )}
              {session && (
                <Link href={`/panel/siparisler/${result.code}`} className="mt-2 inline-block w-full text-xs font-semibold text-[#7844E4] hover:underline">
                  Panelde görüntüle →
                </Link>
              )}
              <button
                type="button"
                onClick={() => setResult(null)}
                className="mt-2 w-full text-xs font-semibold text-[#666F94] hover:text-[#7844E4]"
              >
                Yeni sipariş ver
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{service.platformIcon}</span>
                <div>
                  <p className="text-sm font-bold text-[#33353E]">Sipariş Özeti</p>
                  <p className="text-xs font-semibold" style={{ color }}>{tier.shortName}</p>
                </div>
              </div>
              <div className="mt-3 rounded-xl p-3" style={{ backgroundColor: service.platformColorLight }}>
                <p className="text-sm font-semibold text-[#33353E]">{formatAmount(selected.amount)} {service.unit}</p>
                <p className="text-2xl font-black" style={{ color: tierColor }}>{formatPrice(selected.price)} ₺</p>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-[#33353E]">{service.inputLabel ?? 'Kullanıcı adı'}</label>
                  <div className="flex overflow-hidden rounded-xl border-2 border-[#E9EBF5] bg-white">
                    {service.inputPrefix && (
                      <span className="flex items-center bg-[#F0F1F9] px-3 text-sm font-semibold text-[#666F94]">{service.inputPrefix}</span>
                    )}
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="kullaniciadi"
                      className="flex-1 px-3 py-2.5 text-sm font-medium outline-none"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-[#33353E]">
                    E-posta {session ? '(telafi için)' : '(ödeme için zorunlu)'}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@email.com"
                    className="w-full rounded-xl border-2 border-[#E9EBF5] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#7844E4]"
                    required={!session}
                    disabled={loading}
                  />
                </div>
                {session ? (
                  <div className="flex items-center justify-between gap-2 rounded-xl bg-[#EDE5FF] px-3 py-2.5 text-xs font-semibold text-[#7844E4]">
                    <span>Panel bakiyeniz: <strong>{formatPrice(session.balance)} ₺</strong></span>
                    {session.balance < selected.price && (
                      <Link href="/panel/bakiye" className="shrink-0 rounded-lg bg-[#7844E4] px-2.5 py-1 text-[10px] font-bold text-white hover:bg-[#6835d3]">
                        Bakiye Yükle
                      </Link>
                    )}
                  </div>
                ) : (
                  <p className="rounded-xl bg-[#EDE5FF] px-3 py-2 text-xs font-semibold text-[#5B3FA0]">
                    Kayıt olmadan <strong>iyzico ile güvenli ödeme</strong> yapabilirsiniz.
                    Üye iseniz <Link href="/giris" className="font-bold text-[#7844E4] underline">bakiyeden alın</Link>.
                  </p>
                )}
              </div>

              {error && (
                <p className="mt-3 rounded-lg bg-red-50 p-2 text-xs font-semibold text-red-600">{error}</p>
              )}

              <button
                type="button"
                onClick={() => {
                  addToCart({
                    serviceSlug: service.slug,
                    serviceTitle: service.title,
                    tierId,
                    packageId: selectedPkgId,
                    amount: selected.amount,
                    price: selected.price,
                    unit: service.unit,
                  })
                }}
                className="mt-4 w-full rounded-2xl border-2 py-3 text-sm font-bold text-[#7844E4]"
                style={{ borderColor: tierColor }}
              >
                Sepete Ekle
              </button>

              {!session ? (
                <>
                  <button
                    type="button"
                    onClick={handleIyzicoCheckout}
                    disabled={loading || !iyzicoEnabled}
                    className="mt-4 flex w-full items-center justify-center rounded-2xl py-3.5 text-sm font-black text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                    style={{ backgroundColor: tierColor }}
                  >
                    {loading
                      ? 'Ödeme hazırlanıyor…'
                      : `Güvenli Ödeme ile Satın Al — ${formatPrice(priceBreakdown.gross)} ₺`}
                  </button>
                  {!iyzicoEnabled && (
                    <p className="mt-2 text-center text-[10px] font-semibold text-[#666F94]">
                      Ödeme için lütfen e-posta adresinizi girin veya üye girişi yapın.
                    </p>
                  )}
                  <Link
                    href="/giris"
                    className="mt-3 flex w-full items-center justify-center rounded-2xl border-2 py-3 text-sm font-bold text-[#7844E4]"
                    style={{ borderColor: tierColor }}
                  >
                    Üye Girişi — Bakiyeden Al
                  </Link>
                </>
              ) : session.balance < selected.price ? (
                <Link
                  href="/panel/bakiye"
                  className="mt-4 flex w-full items-center justify-center rounded-2xl py-3.5 text-sm font-black text-white"
                  style={{ backgroundColor: tierColor }}
                >
                  Bakiye Yükle — {formatPrice(selected.price)} ₺ gerekli
                </Link>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 w-full rounded-2xl py-3.5 text-sm font-black text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: tierColor }}
                >
                  {loading ? 'Sipariş Gönderiliyor…' : `Bakiyeden Al — ${formatPrice(selected.price)} ₺`}
                </button>
              )}
              <p className="mt-2 text-center text-[10px] font-semibold text-[#7A7F99]">
                {session
                  ? 'Ödeme panel bakiyenizde kalır · Siparişte otomatik düşer · Anında teslimat'
                  : '3D Secure · iyzico güvenli ödeme · Kart bilgisi saklanmaz'}
              </p>
              <div className="mt-4 space-y-3">
                <PaymentTrustBar variant="light" showLinks={false} />
                <LegalConsentNote />
              </div>
            </>
          )}
        </form>
      </div>

      {checkout && (
        <IyzicoCheckout
          checkoutFormContent={checkout.checkoutFormContent}
          gross={checkout.gross}
          packageLabel={`${formatAmount(selected.amount)} ${service.unit}`}
          onClose={() => setCheckout(null)}
        />
      )}
    </div>
  )
}
