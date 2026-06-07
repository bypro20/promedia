'use client'

import { useState } from 'react'
import type { ServiceDefinition, PackageTier } from '@/lib/packages'
import { getDefaultPackageId } from '@/lib/packages'
import { formatAmount, formatPrice } from '@/lib/format'

const TIER_ACTIVE: Record<PackageTier, string> = {
  standart: 'tier-standart-active text-white shadow-lg',
  premium: 'tier-premium-active text-white shadow-lg',
  gercek: 'tier-gercek-active text-white shadow-lg',
}

type Props = {
  service: ServiceDefinition
}

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
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      {/* Sol — paket seçimi */}
      <div className="sd-card p-5 sm:p-6">
        {/* Süper Fırsatlar bandı */}
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple/10 to-pink/10 px-4 py-2.5">
          <span className="text-lg">🔥</span>
          <span className="text-sm font-bold text-purple">Süper Fırsatlar</span>
          <span className="text-xs text-muted">— En uygun paketleri seçin</span>
        </div>

        {/* 3 kademe — SosyalDigital gibi */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {service.tiers.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => selectTier(t.id)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                tierId === t.id
                  ? TIER_ACTIVE[t.id]
                  : 'border-2 border-purple-light bg-white text-foreground/70 hover:border-purple'
              }`}
            >
              {t.shortName}
              {t.badge && tierId !== t.id && (
                <span className="ml-1.5 rounded bg-orange/20 px-1.5 py-0.5 text-[10px] font-black text-orange">
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Paket grid */}
        <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {tier.packages.map((pkg) => {
            const active = selectedPkgId === pkg.id
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setSelectedPkgId(pkg.id)}
                className={`relative flex min-h-[90px] flex-col items-center justify-center rounded-2xl border-2 px-1 py-3 transition-all ${
                  active ? 'pkg-active scale-[1.03]' : 'border-purple-light bg-white hover:border-purple hover:shadow-md'
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-2.5 rounded-full bg-gradient-to-r from-purple to-pink px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-white shadow-md">
                    Çok Satan
                  </span>
                )}
                {pkg.bonus && !pkg.popular && (
                  <span className="absolute -top-2.5 rounded-full bg-green px-2 py-0.5 text-[8px] font-black text-white shadow">
                    Bonus!
                  </span>
                )}
                {!pkg.popular && !pkg.bonus && pkg.savings ? (
                  <span className="absolute -top-2.5 rounded-full bg-orange px-1.5 py-0.5 text-[8px] font-black text-white shadow">
                    %{pkg.savings} KAR
                  </span>
                ) : null}
                <span className="text-base font-black sm:text-lg">{formatAmount(pkg.amount)}</span>
                <span className={`pkg-price mt-0.5 text-[11px] font-semibold ${active ? '' : 'text-muted'}`}>
                  {formatPrice(pkg.price)} ₺
                </span>
              </button>
            )
          })}
        </div>

        {/* Özellikler */}
        <div className="mt-5 rounded-2xl border border-purple-light bg-purple-light/40 p-4">
          <p className="mb-3 text-sm font-bold text-purple">{tier.name}</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {tier.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green text-white">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sağ — sipariş formu */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <form onSubmit={handleSubmit} className="sd-card overflow-hidden">
          <div className={`bg-gradient-to-r ${tier.color} px-5 py-4 text-white`}>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Seçilen Paket</p>
            <p className="text-2xl font-black">{formatPrice(selected.price)} ₺</p>
            <p className="text-sm opacity-90">{formatAmount(selected.amount)} {service.unit}</p>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <label htmlFor="username" className="text-sm font-bold">{service.inputLabel}</label>
              <div className="relative mt-1.5">
                {service.inputPrefix && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-purple">
                    {service.inputPrefix}
                  </span>
                )}
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="kullaniciadi"
                  className={`w-full rounded-xl border-2 border-purple-light py-3 text-sm outline-none focus:border-purple ${service.inputPrefix ? 'pl-8 pr-3' : 'px-3'}`}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-bold">E-posta</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                className="mt-1.5 w-full rounded-xl border-2 border-purple-light px-3 py-3 text-sm outline-none focus:border-purple"
                required
              />
            </div>

            <button type="submit" className="gradient-btn w-full rounded-xl py-4 text-base font-black text-white">
              Satın Al
            </button>

            <p className="text-center text-[11px] text-muted">
              🔒 3D Secure · ✓ Şifre istemiyoruz · ⚡ 0–15 dk teslimat
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
