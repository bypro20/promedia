'use client'

import { useState } from 'react'
import type { ServiceDefinition, PackageTier } from '@/lib/packages'
import { getDefaultPackageId } from '@/lib/packages'
import { formatAmount, formatPrice } from '@/lib/format'

type Props = { service: ServiceDefinition }

export function ServiceOrderPanel({ service }: Props) {
  const [tierId, setTierId] = useState<PackageTier>(service.defaultTier)
  const [selectedPkgId, setSelectedPkgId] = useState(() =>
    getDefaultPackageId(service.tiers, service.defaultTier)
  )
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')

  const tier = service.tiers.find((t) => t.id === tierId)!
  const selected = tier.packages.find((p) => p.id === selectedPkgId) ?? tier.packages[0]

  function selectTier(id: PackageTier) {
    setTierId(id)
    setSelectedPkgId(getDefaultPackageId(service.tiers, id))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!username.trim()) return
    alert(
      `Sipariş Özeti\n\n${service.title}\n${tier.name}\n${formatAmount(selected.amount)} ${service.unit}\n${formatPrice(selected.price)} ₺\n\nÖdeme sistemi yakında aktif olacak.`
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-[#282D40] shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
      {/* SD: package-tabs — dark bg, white active tab */}
      <div className="flex overflow-x-auto scrollbar-hide">
        {service.tiers.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => selectTier(t.id)}
            className={`shrink-0 px-6 py-4 text-sm font-semibold transition-all ${
              tierId === t.id
                ? 'rounded-t-xl bg-white text-[#2A303C]'
                : 'text-white/70 hover:text-white'
            }`}
          >
            {t.shortName}
            {t.badge && tierId !== t.id && (
              <span className="ml-1.5 rounded bg-[#FD5501] px-1.5 py-0.5 text-[10px] font-bold text-white">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid gap-6 bg-white p-5 lg:grid-cols-[1fr_320px] lg:p-6">
        {/* Paket grid */}
        <div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {tier.packages.map((pkg) => {
              const active = selectedPkgId === pkg.id
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setSelectedPkgId(pkg.id)}
                  className={`relative flex min-h-[72px] flex-col items-center justify-center rounded-xl border-2 px-1 py-3 transition-all ${
                    active
                      ? 'border-[#7844E4] bg-[#7844E4] text-white shadow-md'
                      : 'border-[#E9EBF5] bg-white hover:border-[#7844E4]'
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-2 rounded-full bg-[#7844E4] px-1.5 py-0.5 text-[8px] font-bold uppercase text-white">
                      Çok Satan
                    </span>
                  )}
                  {pkg.bonus && !pkg.popular && (
                    <span className="absolute -top-2 rounded-full bg-[#10B981] px-1.5 py-0.5 text-[8px] font-bold text-white">
                      Bonus!
                    </span>
                  )}
                  {!pkg.popular && !pkg.bonus && pkg.savings ? (
                    <span className="absolute -top-2 rounded-full bg-[#FD5501] px-1 py-0.5 text-[8px] font-bold text-white">
                      %{pkg.savings} KAR
                    </span>
                  ) : null}
                  <span className="text-base font-bold">{formatAmount(pkg.amount)}</span>
                  <span className={`mt-0.5 text-[11px] font-semibold ${active ? 'text-white/85' : 'text-[#666F94]'}`}>
                    {formatPrice(pkg.price)} ₺
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-5 rounded-xl bg-[#F0F1F9] p-4">
            <p className="text-sm font-semibold text-[#7844E4]">{tier.name}</p>
            <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
              {tier.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-[#33353E]">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#10B981] text-white">
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

        {/* Sidebar sipariş */}
        <form onSubmit={handleSubmit} className="rounded-xl border border-[#E9EBF5] bg-[#FBFDFF] p-5">
          <p className="text-sm font-semibold text-[#33353E]">Sipariş Özeti</p>
          <div className="mt-3 space-y-1 text-sm text-[#666F94]">
            <p>{formatAmount(selected.amount)} {service.unit}</p>
            <p className="text-2xl font-bold text-[#7844E4]">{formatPrice(selected.price)} ₺</p>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#666F94]">
                {service.inputLabel ?? 'Kullanıcı adı'}
              </label>
              <div className="flex overflow-hidden rounded-xl border border-[#E9EBF5] bg-white">
                {service.inputPrefix && (
                  <span className="flex items-center bg-[#F0F1F9] px-3 text-sm text-[#666F94]">{service.inputPrefix}</span>
                )}
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="kullaniciadi"
                  className="flex-1 px-3 py-2.5 text-sm outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#666F94]">E-posta</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                className="w-full rounded-xl border border-[#E9EBF5] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#7844E4]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 w-full rounded-2xl bg-[#7844E4] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#6835d3]"
          >
            Satın Al — {formatPrice(selected.price)} ₺
          </button>
          <p className="mt-2 text-center text-[10px] text-[#7A7F99]">3D Secure · Şifre istemiyoruz</p>
        </form>
      </div>
    </div>
  )
}
