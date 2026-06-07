'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PLATFORM_SERVICES } from '@/lib/catalog'
import { IconChevronDown, HeroIllustration } from '@/components/icons'

const PLATFORMS = ['Instagram', 'TikTok', 'YouTube']

export function HeroSection() {
  const [platform, setPlatform] = useState('Instagram')
  const group = PLATFORM_SERVICES.find((p) => p.platform === platform)!
  const [category, setCategory] = useState(group.items[0]?.href ?? '/instagram-takipci-satin-al')

  function selectPlatform(name: string) {
    setPlatform(name)
    const g = PLATFORM_SERVICES.find((p) => p.platform === name)!
    setCategory(g.items[0]?.href ?? '/hizmetler')
  }

  return (
    <section className="bg-white py-10">
      <div className="sd-container">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EDE5FF] px-3 py-1.5">
              <span className="text-[#7844E4]">★</span>
              <h1 className="text-sm font-semibold text-[#7844E4]">
                Instagram Takipçi Satın Al – %100 Güvenilir
              </h1>
            </div>

            <p className="mt-4 text-xl font-semibold text-[#33353E]">
              Sosyal Medyada{' '}
              <span className="text-[30px] text-[#7844E4]">Hızlı ve Akıllı Büyüme</span>
            </p>

            <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#666F94]">
              ProMedia, Instagram takipçi satın alma sürecini güvenli altyapı, hız ve hesap güvenliği odaklı olarak sunar.
            </p>

            <div className="mt-6 space-y-3 rounded-2xl border border-[#E9EBF5] bg-[#FBFDFF] p-4">
              <div>
                <span className="text-sm font-semibold text-[#666F94]">Platform Seç</span>
                <div className="mt-2 flex gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => selectPlatform(p)}
                      className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                        platform === p
                          ? 'bg-[#7844E4] text-white shadow-md'
                          : 'border border-[#E9EBF5] bg-white text-[#33353E] hover:border-[#7844E4]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-sm font-semibold text-[#666F94]">Kategori Seç</span>
                <div className="relative mt-2">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-[#E9EBF5] bg-white px-4 py-3 text-sm font-semibold text-[#33353E] outline-none focus:border-[#7844E4] focus:ring-2 focus:ring-[#7844E4]/10"
                  >
                    {group.items.map((s) => (
                      <option key={s.href} value={s.href}>{s.name}</option>
                    ))}
                  </select>
                  <IconChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <Link
                href={category}
                className="flex w-full items-center justify-center rounded-2xl bg-[#7844E4] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#6835d3]"
              >
                Paketleri İncele
              </Link>
            </div>
          </div>

          <div className="hidden justify-center lg:flex">
            <HeroIllustration className="max-h-[400px] w-full max-w-md" />
          </div>
        </div>
      </div>
    </section>
  )
}
