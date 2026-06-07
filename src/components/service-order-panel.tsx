'use client'

import { useState } from 'react'
import { INSTAGRAM_FOLLOWER_TIERS, type PackageTier } from '@/lib/packages'
import { formatAmount, formatPrice } from '@/lib/format'

export function ServiceOrderPanel() {
  const [tierId, setTierId] = useState<PackageTier>('standart')
  const [selectedPkgId, setSelectedPkgId] = useState('s-1k')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')

  const tier = INSTAGRAM_FOLLOWER_TIERS.find((t) => t.id === tierId)!
  const selected = tier.packages.find((p) => p.id === selectedPkgId) ?? tier.packages[0]

  function selectTier(id: PackageTier) {
    setTierId(id)
    const next = INSTAGRAM_FOLLOWER_TIERS.find((t) => t.id === id)!
    const popular = next.packages.find((p) => p.popular) ?? next.packages[0]
    setSelectedPkgId(popular.id)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!username.trim()) return
    alert(
      `Sipariş özeti:\n${formatAmount(selected.amount)} takipçi — ${formatPrice(selected.price)} ₺\nKullanıcı: @${username.replace('@', '')}\n\nÖdeme entegrasyonu bir sonraki adımda eklenecek.`
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div>
        {/* Tier tabs */}
        <div className="flex flex-wrap gap-2">
          {INSTAGRAM_FOLLOWER_TIERS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => selectTier(t.id)}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all ${
                tierId === t.id
                  ? 'bg-accent text-white shadow-sm'
                  : 'border border-border bg-card text-muted hover:border-accent/30 hover:text-foreground'
              }`}
            >
              {t.name}
              {t.badge && tierId !== t.id && (
                <span className="ml-1.5 text-[10px] uppercase tracking-wide text-accent">
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Package grid */}
        <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3">
          {tier.packages.map((pkg) => {
            const active = selectedPkgId === pkg.id
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setSelectedPkgId(pkg.id)}
                className={`relative flex flex-col items-center rounded-xl border px-2 py-4 transition-all ${
                  active
                    ? 'border-accent bg-accent-soft ring-1 ring-accent'
                    : 'border-border bg-card hover:border-accent/40'
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-2 rounded-full bg-foreground px-2 py-0.5 text-[10px] font-medium text-white">
                    Popüler
                  </span>
                )}
                {pkg.bonus && !pkg.popular && (
                  <span className="absolute -top-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-medium text-white">
                    Bonus
                  </span>
                )}
                <span className="text-lg font-semibold">{formatAmount(pkg.amount)}</span>
                <span className="mt-1 text-xs text-muted">{formatPrice(pkg.price)} ₺</span>
              </button>
            )
          })}
        </div>

        {/* Tier features */}
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {tier.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-muted">
              <svg className="h-4 w-4 shrink-0 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Order sidebar */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <p className="text-sm font-medium text-muted">Seçilen paket</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-semibold">{formatAmount(selected.amount)} takipçi</span>
            <span className="text-2xl font-semibold text-accent">{formatPrice(selected.price)} ₺</span>
          </div>
          <p className="mt-1 text-xs text-muted">{tier.name}</p>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium">
                Instagram kullanıcı adı
              </label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">@</span>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="kullaniciadi"
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-8 pr-3 text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                E-posta
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-accent py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Satın Al
          </button>

          <p className="mt-4 text-center text-xs leading-relaxed text-muted">
            3D Secure ile güvenli ödeme · Şifre istemiyoruz
          </p>
        </form>
      </div>
    </div>
  )
}
