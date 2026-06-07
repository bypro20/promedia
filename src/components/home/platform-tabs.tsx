'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PLATFORM_SERVICES } from '@/lib/catalog'

export function PlatformTabs() {
  const [active, setActive] = useState(0)
  const group = PLATFORM_SERVICES[active]

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-center text-2xl font-black sm:text-3xl">
          Sosyal Medya <span className="gradient-text">Hizmetlerimiz</span>
        </h2>
        <p className="mt-1 text-center text-muted">Sosyal medyada en çok ilgi gören hizmetlerimiz</p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {PLATFORM_SERVICES.map((p, i) => (
            <button
              key={p.platform}
              type="button"
              onClick={() => setActive(i)}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                active === i ? 'gradient-btn text-white shadow-md' : 'border-2 border-purple-light bg-white hover:border-purple'
              }`}
            >
              {p.icon} {p.platform}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {group.items.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="sd-card flex items-center justify-between px-4 py-3.5 text-sm font-semibold hover:text-purple"
            >
              {s.name}
              <span className="text-purple">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
