import type { Metadata } from 'next'
import Link from 'next/link'
import { PLATFORM_SERVICES, SERVICE_COUNT } from '@/lib/catalog'

export const metadata: Metadata = {
  title: 'Tüm Hizmetler',
  description: `ProMedia — ${SERVICE_COUNT}+ sosyal medya hizmeti. Instagram, TikTok, YouTube, Twitter ve daha fazlası.`,
}

export default function HizmetlerPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-black">Tüm Hizmetler</h1>
      <p className="mt-2 text-muted">{SERVICE_COUNT} hizmet · Standart · Premium · Gerçek VIP paketler</p>

      <div className="mt-10 space-y-10">
        {PLATFORM_SERVICES.map((group) => (
          <section key={group.platform}>
            <h2 className={`flex items-center gap-2 bg-gradient-to-r ${group.color} bg-clip-text text-xl font-black text-transparent`}>
              <span>{group.icon}</span> {group.platform} Hizmetleri
            </h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {group.items.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="sd-card flex items-center justify-between px-4 py-3.5 text-sm font-semibold hover:border-purple hover:text-purple"
                >
                  {s.name}
                  <span className="text-purple">→</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
