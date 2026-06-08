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
  const [useBalance, setUseBalance] = useState(true)

  useEffect(() => {
    void fetch('/api/auth').then((r) => r.json()).then((d) => {
      if (d.ok) setSession(d.user)
    })
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
          payFromBalance: session ? useBalance : false,
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
              className={`relative shrink-0 px-5 py-4 text-sm font-bold transition-all sm:px-6 ${
                active ? 'rounded-t-xl bg-white text-[#2A303C]' : 'text-white/75 hover:text-white'
              }`}
            >
              {!active && (
                <span
                  className="absolute bottom-0 left-0 h-0.5 w-full opacity-60"
                  style={{ backgroundColor: tc?.active }}
                />
              )}
              {t.shortName}
              {t.badge && (
                <span
                  className="ml-1.5 rounded px-1.5 py-0.5 text-[9px] font-black uppercase text-white"
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
              className="rounded-full px-3 py-1 text-xs font-bold uppercase text-white"
              style={{ backgroundColor: audienceColor }}
            >
              {service.audience === 'ucuz' ? 'Ucuz Global' : service.audience === 'turk' ? 'Türk' : 'Global'}
            </span>
            <span
              className="rounded-full px-3 py-1 text-xs font-bold text-white"
              style={{ backgroundColor: color }}
            >
              {service.platform}
            </span>
            <span className="text-sm font-semibold text-[#666F94]">{tier.description}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {tier.packages.map((pkg) => {
              const active = selectedPkgId === pkg.id
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => {
                    setSelectedPkgId(pkg.id)
                    setResult(null)
                  }}
                  className={`relative flex min-h-[76px] flex-col items-center justify-center rounded-xl border-2 px-1 py-3 transition-all ${
                    active ? 'text-white shadow-lg scale-[1.03]' : 'border-[#E9EBF5] bg-white hover:shadow-md'
                  }`}
                  style={
                    active
                      ? { backgroundColor: tierColor, borderColor: tierColor }
                      : { borderColor: '#E9EBF5' }
                  }
                >
                  {pkg.cheap && !pkg.popular && (
                    <span className="absolute -top-2 rounded-full bg-[#10B981] px-1.5 py-0.5 text-[8px] font-black uppercase text-white">
                      Ucuz
                    </span>
                  )}
                  {pkg.popular && (
                    <span className="absolute -top-2 rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase text-white" style={{ backgroundColor: color }}>
                      Çok Satan
                    </span>
                  )}
                  {pkg.bonus && !pkg.popular && !pkg.cheap && (
                    <span className="absolute -top-2 rounded-full bg-[#10B981] px-1.5 py-0.5 text-[8px] font-black text-white">
                      Bonus!
                    </span>
                  )}
                  {!pkg.popular && !pkg.bonus && !pkg.cheap && pkg.savings ? (
                    <span className="absolute -top-2 rounded-full bg-[#FD5501] px-1 py-0.5 text-[8px] font-black text-white">
                      %{pkg.savings} KAR
                    </span>
                  ) : null}
                  <span className="text-base font-black">{formatAmount(pkg.amount)}</span>
                  <span className={`mt-0.5 text-[11px] font-bold ${active ? 'text-white/90' : 'text-[#666F94]'}`}>
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
                {result.status === 'failed' ? '⚠️' : '✓'}
              </div>
              <p className="mt-3 text-lg font-black text-[#33353E]">
                {result.status === 'failed' ? 'Sipariş Hatası' : 'Sipariş Alındı!'}
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
                  <label className="mb-1 block text-xs font-bold text-[#33353E]">E-posta (telafi için)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@email.com"
                    className="w-full rounded-xl border-2 border-[#E9EBF5] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#7844E4]"
                    disabled={loading}
                  />
                </div>
                {session ? (
                  <label className="flex items-center gap-2 rounded-xl bg-[#EDE5FF] px-3 py-2 text-xs font-semibold text-[#7844E4]">
                    <input type="checkbox" checked={useBalance} onChange={(e) => setUseBalance(e.target.checked)} />
                    Bakiyeden öde ({formatPrice(session.balance)} ₺)
                  </label>
                ) : (
                  <p className="text-xs text-[#666F94]">
                    <Link href="/giris" className="font-bold text-[#7844E4]">Giriş yap</Link> — bakiyeden öde
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

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full rounded-2xl py-3.5 text-sm font-black text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: tierColor }}
              >
                {loading ? 'Sipariş Gönderiliyor…' : `Satın Al — ${formatPrice(selected.price)} ₺`}
              </button>
              <p className="mt-2 text-center text-[10px] font-semibold text-[#7A7F99]">
                SMM API ile anında teslimat · Şifre istemiyoruz · Telafi garantili
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
