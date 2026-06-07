import Link from 'next/link'
import { PLATFORM_SERVICES, SERVICE_COUNT } from '@/lib/catalog'
import { Testimonials } from '@/components/testimonials'
import { FaqSection } from '@/components/faq-section'

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-dark via-purple to-pink px-4 py-16 text-white sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <span className="rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold">
            🔥 Yeni üyelere %10 indirim
          </span>
          <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Sosyal Medyada
            <br />
            <span className="text-pink-200">Profesyonel Büyüme</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/85">
            Instagram, TikTok, YouTube ve {SERVICE_COUNT}+ hizmet.
            Standart · Premium · Gerçek VIP paketler. Hızlı teslimat, telafi garantisi.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/instagram-takipci-satin-al" className="rounded-full bg-white px-7 py-3.5 text-sm font-black text-purple shadow-lg hover:bg-purple-light">
              Instagram Takipçi Al
            </Link>
            <Link href="/hizmetler" className="rounded-full border-2 border-white/60 px-7 py-3.5 text-sm font-bold hover:bg-white/10">
              Tüm Hizmetler
            </Link>
          </div>
        </div>
      </section>

      {/* Güven bandı */}
      <section className="border-b border-purple-light bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-4 sm:px-6">
          {[
            { icon: '⚡', label: '0–15 dk teslimat' },
            { icon: '🔒', label: '3D Secure ödeme' },
            { icon: '🛡️', label: 'Telafi garantisi' },
            { icon: '💬', label: '7/24 canlı destek' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm font-bold">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Platform kartları */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-black">En Çok Kullanılan Kategoriler</h2>
        <p className="mt-1 text-muted">Tüm platformlar · Standart · Premium · Gerçek VIP</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PLATFORM_SERVICES.map((group) => (
            <div key={group.platform} className="sd-card overflow-hidden">
              <div className={`bg-gradient-to-r ${group.color} px-5 py-4 text-white`}>
                <span className="text-2xl">{group.icon}</span>
                <p className="mt-1 text-lg font-black">{group.platform}</p>
              </div>
              <ul className="divide-y divide-purple-light p-3">
                {group.items.map((s) => (
                  <li key={s.href}>
                    <Link href={s.href} className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-purple-light hover:text-purple">
                      {s.name}
                      <span className="text-purple">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/hizmetler" className="gradient-btn inline-flex rounded-full px-8 py-3.5 text-sm font-black text-white">
            Tüm {SERVICE_COUNT} Hizmeti Gör
          </Link>
        </div>
      </section>

      <Testimonials />
      <FaqSection />
    </main>
  )
}
