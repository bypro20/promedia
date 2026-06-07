import Link from 'next/link'
import { HeroSelector } from '@/components/home/hero-selector'
import { PopularPackages } from '@/components/home/popular-packages'
import { PlatformTabs } from '@/components/home/platform-tabs'
import { FeatureShowcase } from '@/components/home/feature-showcase'
import { WhyUs } from '@/components/home/why-us'
import { Testimonials } from '@/components/testimonials'
import { FaqSection } from '@/components/faq-section'
import { SERVICE_COUNT } from '@/lib/catalog'

export default function HomePage() {
  return (
    <main>
      {/* Hero — SosyalDigital tarzı */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#5521c9] via-[#6c3ce7] to-[#e91e8c] px-4 py-14 text-white sm:px-6 sm:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-pink/30 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
                Süper Fırsatlar
              </span>
              <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                Instagram Takipçi Satın Al
                <span className="mt-2 block text-xl font-normal text-white/90 sm:text-2xl">
                  — %100 Güvenilir
                </span>
              </h1>
              <p className="mt-2 text-lg font-semibold text-pink-200">
                Sosyal Medyada Hızlı ve Akıllı Büyüme
              </p>
              <p className="mt-4 max-w-lg text-white/80 leading-relaxed">
                ProMedia, takipçi satın alma sürecini güvenli altyapı, hız ve hesap güvenliği odaklı sunar.
                {SERVICE_COUNT}+ hizmet, 3D Secure ödeme, 7/24 destek.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {['⚡ Hızlı Teslimat', '🔒 Güvenli Ödeme', '🛡️ Telafi Garantisi', '💬 7/24 Destek'].map((t) => (
                  <span key={t} className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold">{t}</span>
                ))}
              </div>
            </div>
            <HeroSelector />
          </div>
        </div>
      </section>

      {/* TikTok + Ücretsiz araçlar bandı */}
      <section className="border-b border-border bg-white py-8">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 sm:px-6">
          <div className="sd-card flex items-center gap-4 p-5">
            <span className="text-4xl">🎵</span>
            <div>
              <p className="font-black">TikTok Paketlerini Keşfedin</p>
              <p className="mt-1 text-sm text-muted">TikTok hizmetlerimizle daha görünür olun!</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {['/tiktok-takipci-satin-al', '/tiktok-begeni-satin-al', '/tiktok-izlenme-satin-al'].map((h) => (
                  <Link key={h} href={h} className="text-xs font-bold text-purple hover:underline">
                    {h.split('-')[1]} →
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="sd-card flex items-center gap-4 p-5">
            <span className="text-4xl">🆓</span>
            <div>
              <p className="font-black">Ücretsiz Araçlarımızı İnceleyin</p>
              <p className="mt-1 text-sm text-muted">Ücretsiz araçlarla etkileşim arttırmaya başlayın!</p>
              <Link href="#" className="mt-2 inline-block text-xs font-bold text-purple hover:underline">İnceleyin →</Link>
            </div>
          </div>
        </div>
      </section>

      <PlatformTabs />
      <PopularPackages />

      {/* Memnuniyet bandı */}
      <section className="bg-gradient-to-r from-purple-dark to-purple py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-white/70">Her siparişte memnuniyet</p>
          <h2 className="mt-2 text-2xl font-black sm:text-3xl">Müşteri Memnuniyeti Önceliğimiz</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: '💬', title: '7/24 Canlı Destek', text: 'Her siparişte hızlı teslimat ve gerçek etkileşim.' },
              { icon: '🔍', title: 'Güvenli ve Şeffaf', text: 'Siparişlerinizin her adımını takip edebilirsiniz.' },
              { icon: '🚀', title: 'Hızlı Sonuç, Kalıcı Etki', text: 'Uzun vadeli memnuniyet odaklı hizmet.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                <span className="text-3xl">{item.icon}</span>
                <p className="mt-3 font-black">{item.title}</p>
                <p className="mt-2 text-sm text-white/75">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeatureShowcase />
      <WhyUs />
      <Testimonials />
      <FaqSection />
    </main>
  )
}
