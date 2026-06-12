'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { PLATFORM_SERVICES, getService } from '@/lib/catalog'
import { IconChevronDown } from '@/components/icons'
import { formatAmount, formatPrice } from '@/lib/format'
import { getDefaultPackageId } from '@/lib/packages'

export function HeroSection() {
  const [platform, setPlatform] = useState('Instagram')
  const group = PLATFORM_SERVICES.find((p) => p.platform === platform)!
  const [category, setCategory] = useState(group.items[0]?.href ?? '/instagram-takipci-satin-al')

  const slug = category.slice(1)
  const service = useMemo(() => getService(slug), [slug])
  const tier = service?.tiers.find((t) => t.id === service.defaultTier) ?? service?.tiers[0]
  const packages = tier?.packages ?? []

  const [pkgId, setPkgId] = useState('')

  useEffect(() => {
    if (service) {
      setPkgId(getDefaultPackageId(service.tiers, service.defaultTier))
    }
  }, [service])

  function selectPlatform(name: string) {
    setPlatform(name)
    const g = PLATFORM_SERVICES.find((p) => p.platform === name)!
    setCategory(g.items[0]?.href ?? '/hizmetler')
  }

  function selectCategory(href: string) {
    setCategory(href)
  }

  const selectedPkg = packages.find((p) => p.id === pkgId)
  const ready = Boolean(category && pkgId && selectedPkg)
  const ctaHref = category

  return (
    <section className="bg-[#F0F1F9] py-6 lg:py-10">
      <div className="sd-container">
        <div className="mx-auto max-w-xl rounded-[24px] border border-[#E9EBF5] bg-white p-6 shadow-[0_8px_40px_rgba(120,68,228,0.1)]">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EDE5FF] px-3 py-1.5">
            <span className="text-[#7844E4]">★</span>
            <h1 className="text-sm font-semibold text-[#7844E4]">
              Instagram Takipçi Satın Al – %100 Güvenilir
            </h1>
          </div>

          <p className="mt-4 text-xl font-semibold text-[#33353E]">
            Sosyal Medyada{' '}
            <span className="text-[26px] text-[#7844E4]">Hızlı ve Akıllı Büyüme</span>
          </p>

          <p className="mt-3 text-sm leading-relaxed text-[#666F94]">
            ProMedia, Instagram takipçi satın alma sürecini güvenli altyapı, hız ve hesap güvenliği odaklı olarak sunar.
          </p>

          <form
            className="mt-6 space-y-3"
            onSubmit={(e) => {
              e.preventDefault()
              if (ready) window.location.href = ctaHref
            }}
          >
            <div>
              <label htmlFor="hero-platform" className="text-sm font-semibold text-[#666F94]">
                Platform Seç
              </label>
              <div className="relative mt-2">
                <select
                  id="hero-platform"
                  value={platform}
                  onChange={(e) => selectPlatform(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-[#E9EBF5] bg-white px-4 py-3 text-sm font-semibold text-[#33353E] outline-none focus:border-[#7844E4] focus:ring-2 focus:ring-[#7844E4]/10"
                >
                  {PLATFORM_SERVICES.filter((p) =>
                    ['Instagram', 'TikTok', 'YouTube'].includes(p.platform)
                  ).map((p) => (
                    <option key={p.platform} value={p.platform}>
                      {p.platform}
                    </option>
                  ))}
                </select>
                <IconChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label htmlFor="hero-category" className="text-sm font-semibold text-[#666F94]">
                Kategori Seç
              </label>
              <div className="relative mt-2">
                <select
                  id="hero-category"
                  value={category}
                  onChange={(e) => selectCategory(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-[#E9EBF5] bg-white px-4 py-3 text-sm font-semibold text-[#33353E] outline-none focus:border-[#7844E4] focus:ring-2 focus:ring-[#7844E4]/10"
                >
                  {group.items.map((s) => (
                    <option key={s.href} value={s.href}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <IconChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label htmlFor="hero-package" className="text-sm font-semibold text-[#666F94]">
                Paket Seç
              </label>
              <div className="relative mt-2">
                <select
                  id="hero-package"
                  value={pkgId}
                  onChange={(e) => setPkgId(e.target.value)}
                  disabled={packages.length === 0}
                  className="w-full appearance-none rounded-xl border border-[#E9EBF5] bg-white px-4 py-3 text-sm font-semibold text-[#33353E] outline-none focus:border-[#7844E4] focus:ring-2 focus:ring-[#7844E4]/10 disabled:opacity-50"
                >
                  {packages.length === 0 ? (
                    <option value="">Paket yükleniyor…</option>
                  ) : (
                    packages.map((p) => (
                      <option key={p.id} value={p.id}>
                        {formatAmount(p.amount)} {service?.unit ?? ''} — {formatPrice(p.price)} ₺
                      </option>
                    ))
                  )}
                </select>
                <IconChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {ready ? (
              <Link
                href={ctaHref}
                className="flex w-full items-center justify-center rounded-2xl bg-[#7844E4] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#6835d3]"
              >
                Paketleri İncele
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="flex w-full cursor-not-allowed items-center justify-center rounded-2xl bg-[#E9EBF5] py-3.5 text-sm font-semibold text-[#666F94]"
              >
                Paketleri İncele
              </button>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
