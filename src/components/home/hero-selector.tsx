'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PLATFORM_SERVICES } from '@/lib/catalog'

const HERO_PLATFORMS = ['Instagram', 'TikTok', 'YouTube']

export function HeroSelector() {
  const [platform, setPlatform] = useState('Instagram')
  const group = PLATFORM_SERVICES.find((p) => p.platform === platform)!
  const [category, setCategory] = useState(group.items[0]?.href ?? '/instagram-takipci-satin-al')

  function selectPlatform(name: string) {
    setPlatform(name)
    const g = PLATFORM_SERVICES.find((p) => p.platform === name)!
    setCategory(g.items[0]?.href ?? '/hizmetler')
  }

  return (
    <div className="sd-card mx-auto max-w-2xl p-6 shadow-xl">
      <p className="mb-4 text-center text-sm font-bold text-purple">🔥 Süper Fırsatlar sizin elinizde!</p>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">Platform Seç</label>
          <div className="flex gap-2">
            {HERO_PLATFORMS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => selectPlatform(p)}
                className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all ${
                  platform === p
                    ? 'gradient-btn text-white shadow-md'
                    : 'border-2 border-purple-light bg-purple-light/50 text-foreground hover:border-purple'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">Kategori Seç</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border-2 border-purple-light bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-purple"
          >
            {group.items.map((s) => (
              <option key={s.href} value={s.href}>{s.name}</option>
            ))}
          </select>
        </div>

        <Link
          href={category}
          className="gradient-btn flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-black text-white"
        >
          Paketleri İncele
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
