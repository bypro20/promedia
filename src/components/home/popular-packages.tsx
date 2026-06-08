import Link from 'next/link'
import { ScrollRow } from '@/components/ui/scroll-row'

const FEATURED = [
  { badge: 'Çok Satanlar', badgeBg: '#7844E4', title: '180 Gün Garantili 250 Türk Takipçi', platform: 'INSTAGRAM', platformColor: '#E1306C', href: '/instagram-turk-takipci-satin-al' },
  { badge: 'KOMBO', badgeBg: '#FD5501', title: 'Organik 80 Kadın Türk Beğeni', platform: 'INSTAGRAM', platformColor: '#E1306C', href: '/instagram-turk-begeni-satin-al' },
  { badge: 'UCUZ', badgeBg: '#10B981', title: '100 Ucuz Global Takipçi', platform: 'INSTAGRAM', platformColor: '#E1306C', href: '/instagram-ucuz-takipci-satin-al' },
  { badge: 'GLOBAL', badgeBg: '#3382FA', title: '10.000 Global Takipçi', platform: 'INSTAGRAM', platformColor: '#E1306C', href: '/instagram-takipci-satin-al' },
]

const PACKAGES = [
  { title: '250 Türk Takipçi', platform: 'INSTAGRAM', price: '139,90', href: '/instagram-turk-takipci-satin-al', color: '#E1306C', type: 'TÜRK' },
  { title: '5.000 Türk Takipçi', platform: 'INSTAGRAM', price: '549,90', href: '/instagram-turk-takipci-satin-al', color: '#E1306C', type: 'TÜRK', featured: true },
  { title: '500 Ucuz Global Beğeni', platform: 'INSTAGRAM', price: '9,90', href: '/instagram-ucuz-begeni-satin-al', color: '#10B981', type: 'UCUZ' },
  { title: '1.000 TikTok Global Takipçi', platform: 'TIKTOK', price: '79,90', href: '/tiktok-takipci-satin-al', color: '#000', type: 'GLOBAL' },
  { title: '100 Ucuz TikTok Takipçi', platform: 'TIKTOK', price: '12,90', href: '/tiktok-ucuz-takipci-satin-al', color: '#10B981', type: 'UCUZ' },
  { title: '1.000 YouTube Global Abone', platform: 'YOUTUBE', price: '149,90', href: '/youtube-abone-satin-al', color: '#FF0000', type: 'GLOBAL' },
  { title: '100 Ucuz YouTube Abone', platform: 'YOUTUBE', price: '19,90', href: '/youtube-ucuz-abone-satin-al', color: '#10B981', type: 'UCUZ' },
  { title: '500 Twitter Global Takipçi', platform: 'TWITTER', price: '49,90', href: '/twitter-takipci-satin-al', color: '#1DA1F2', type: 'GLOBAL' },
]

export function PopularPackages() {
  return (
    <section className="overflow-hidden bg-white py-12">
      <div className="sd-container">
        <div className="text-center">
          <h2 className="text-[26px] font-black text-[#33353E]">
            Sosyal Medya <span className="text-[#E1306C]">Paketlerimiz</span>
          </h2>
          <p className="mt-1 text-[15px] font-semibold text-[#666F94]">Global · Türk · Ucuz — en çok tercih edilen paketler</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="relative overflow-hidden rounded-[20px] bg-[#282D40] px-5 py-4 text-white transition-transform hover:scale-[1.02]"
            >
              <div className="absolute left-0 top-0 h-1 w-full" style={{ backgroundColor: f.platformColor }} />
              <span className="rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase text-white" style={{ backgroundColor: f.badgeBg }}>
                {f.badge}
              </span>
              <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-white/50">{f.platform}</p>
              <p className="mt-1 font-bold leading-snug">{f.title}</p>
              <span className="mt-3 inline-block text-lg text-white/40">→</span>
            </Link>
          ))}
        </div>

        <ScrollRow className="mt-4" desktopGrid="lg:grid-cols-2 xl:grid-cols-4">
          {PACKAGES.map((pkg) => (
            <Link
              key={pkg.title}
              href={pkg.href}
              className={`flex min-w-[260px] flex-col justify-between rounded-[20px] bg-[#282D40] p-5 text-white transition-transform hover:scale-[1.02] lg:min-w-0 ${pkg.featured ? 'ring-2 ring-[#7844E4]' : ''}`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full px-2 py-0.5 text-[9px] font-black uppercase text-white" style={{ backgroundColor: pkg.color }}>
                    {pkg.type}
                  </span>
                  {pkg.featured && <span className="rounded-full bg-[#10B981] px-2 py-0.5 text-[9px] font-black uppercase">Öne Çıkan</span>}
                </div>
                <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-[#BFA0FF]">{pkg.platform}</p>
                <p className="mt-1 font-bold leading-snug">{pkg.title}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xl font-black">{pkg.price} ₺</span>
                <span className="rounded-full px-4 py-1.5 text-xs font-black text-white" style={{ backgroundColor: pkg.color }}>
                  Satın Al
                </span>
              </div>
            </Link>
          ))}
        </ScrollRow>

        <div className="mt-6 overflow-hidden rounded-xl">
          <div className="flex items-center justify-center gap-2 py-4 text-center text-sm font-bold text-white" style={{ backgroundColor: '#E1306C' }}>
            <span className="live-dot h-2.5 w-2.5 rounded-full bg-white" />
            Sitemizde Anlık Olarak <strong className="mx-1">47 Kişi</strong> Alışveriş Yapıyor
          </div>
        </div>
      </div>
    </section>
  )
}
