import type { Metadata } from 'next'
import Link from 'next/link'
import { PLATFORM_SERVICES, SERVICE_COUNT } from '@/lib/catalog'
import { formatStartingPrice } from '@/lib/service-pricing'

export const metadata: Metadata = {
  title: 'Tüm Hizmetler',
  description: `ProMedia — ${SERVICE_COUNT}+ sosyal medya hizmeti. Instagram, TikTok, YouTube, Twitter ve daha fazlası.`,
}

export default function HizmetlerPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-black">Tüm Hizmetler</h1>
      <p className="mt-2 text-muted">{SERVICE_COUNT} hizmet · Fiyatları görün · Sepete ekle · Güvenli ödeme</p>

      <div className="mt-10 space-y-10">
        {PLATFORM_SERVICES.map((group) => (
          <section key={group.platform}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className={`flex items-center gap-2 bg-gradient-to-r ${group.color} bg-clip-text text-xl font-black text-transparent`}>
                <span>{group.icon}</span> {group.platform} Hizmetleri
              </h2>
              <Link
                href={group.items[0]?.href ?? '/hizmetler'}
                className="text-sm font-bold text-[#7844E4] hover:underline"
              >
                {group.platform} paketlerini gör →
              </Link>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {group.items.map((s) => {
                const slug = s.href.slice(1)
                const fromPrice = formatStartingPrice(slug)
                return (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="sd-card flex flex-col gap-2 px-4 py-3.5 hover:border-purple hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-semibold leading-snug">{s.name}</span>
                      <span className="shrink-0 text-purple">→</span>
                    </div>
                    {fromPrice && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#666F94]">{fromPrice}&apos;den itibaren</span>
                        <span className="rounded-full bg-[#7844E4] px-2.5 py-0.5 text-[10px] font-bold text-white">
                          Satın Al
                        </span>
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
