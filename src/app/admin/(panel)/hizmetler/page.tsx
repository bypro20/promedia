import Link from 'next/link'
import { ALL_SERVICES, PLATFORM_SERVICES } from '@/lib/catalog'
import { formatPrice } from '@/lib/format'

export default function AdminServicesPage() {
  const byPlatform = PLATFORM_SERVICES.map((g) => ({
    ...g,
    services: ALL_SERVICES.filter((s) => s.slug.startsWith(g.slug)),
  }))

  return (
    <main className="p-4 lg:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#33353E]">Hizmet Kataloğu</h1>
          <p className="mt-1 text-sm text-[#666F94]">
            Sitedeki tüm {ALL_SERVICES.length} hizmet. Admin hesabınızla bakiyeden sipariş verebilirsiniz.
          </p>
        </div>
        <Link href="/hizmetler" className="rounded-xl bg-[#7844E4] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#6835d3]">
          Sipariş Ver →
        </Link>
      </div>

      <div className="space-y-8">
        {byPlatform.map((group) => (
          <section key={group.slug} className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-[#33353E]">{group.platform}</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {group.services.map((s) => {
                const minPrice = s.tiers?.[0]?.packages?.[0]?.price
                return (
                  <Link
                    key={s.slug}
                    href={`/${s.slug}`}
                    className="rounded-xl border border-[#E9EBF5] px-4 py-3 text-sm hover:border-[#7844E4] hover:bg-[#EDE5FF]/30"
                  >
                    <p className="font-semibold text-[#33353E]">{s.title}</p>
                    <p className="mt-1 text-xs text-[#666F94]">
                      {minPrice != null ? `${formatPrice(minPrice)} ₺'den` : 'Paketler mevcut'}
                    </p>
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
