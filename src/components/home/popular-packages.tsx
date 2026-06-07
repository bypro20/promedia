import Link from 'next/link'

const FEATURED = [
  { badge: 'Çok Satanlar', badgeBg: '#7844E4', title: '180 Gün Garantili 250 Türk Takipçi', platform: 'INSTAGRAM', href: '/instagram-turk-takipci-satin-al' },
  { badge: 'KOMBO', badgeBg: '#FD5501', title: 'Organik 80 Kadın Türk Beğeni', platform: 'INSTAGRAM', href: '/instagram-turk-begeni-satin-al' },
]

const PACKAGES = [
  { title: '250 Türk Takipçi', platform: 'INSTAGRAM', price: '139,90', href: '/instagram-turk-takipci-satin-al' },
  { title: '5.000 Türk Takipçi', platform: 'INSTAGRAM', price: '549,90', href: '/instagram-turk-takipci-satin-al', featured: true },
  { title: 'Organik 80 Türk Beğeni', platform: 'INSTAGRAM', price: '49,90', href: '/instagram-turk-begeni-satin-al' },
  { title: '90 Gün Garantili 100.000 Türk Takipçi', platform: 'INSTAGRAM', price: '2.999,90', href: '/instagram-turk-takipci-satin-al' },
  { title: '180 Gün Garantili 2.000 Türk Takipçi', platform: 'INSTAGRAM', price: '799,90', href: '/instagram-turk-takipci-satin-al' },
  { title: 'Türk Altın Paket', platform: 'INSTAGRAM', price: '1.499,90', href: '/instagram-takipci-satin-al' },
]

export function PopularPackages() {
  return (
    <section className="py-12">
      <div className="sd-container">
        <div className="text-center">
          <h2 className="text-[26px] font-semibold text-[#33353E]">
            Sosyal Medya <span className="text-[#E1306C]">Paketlerimiz</span>
          </h2>
          <p className="mt-1 text-[15px] text-[#666F94]">Sosyal medyada en çok ilgi gören hizmetlerimiz</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {FEATURED.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="flex items-center justify-between rounded-[20px] bg-[#282D40] px-5 py-4 text-white transition-transform hover:scale-[1.01]"
            >
              <div>
                <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase" style={{ backgroundColor: f.badgeBg }}>
                  {f.badge}
                </span>
                <p className="mt-2 font-semibold">{f.title}</p>
                <p className="text-xs text-white/60">{f.platform}</p>
              </div>
              <span className="text-2xl text-white/40">→</span>
            </Link>
          ))}
        </div>

        <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {PACKAGES.map((pkg) => (
            <Link
              key={pkg.title}
              href={pkg.href}
              className={`flex min-w-[280px] shrink-0 flex-col justify-between rounded-[20px] bg-[#282D40] p-5 text-white transition-transform hover:scale-[1.01] ${pkg.featured ? 'ring-2 ring-[#7844E4]' : ''}`}
            >
              <div>
                {pkg.featured && (
                  <span className="rounded-full bg-[#10B981] px-2.5 py-0.5 text-[10px] font-bold uppercase">Öne Çıkan</span>
                )}
                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-[#BFA0FF]">{pkg.platform}</p>
                <p className="mt-1 font-semibold leading-snug">{pkg.title}</p>
                {pkg.featured && (
                  <ul className="mt-3 space-y-1 text-xs text-white/70">
                    <li>✓ Hızlı Teslimat</li>
                    <li>✓ Güvenli Ödeme</li>
                    <li>✓ 7/24 Destek</li>
                    <li>✓ Telafi Garantisi</li>
                  </ul>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xl font-bold">{pkg.price} ₺</span>
                <span className="rounded-full bg-[#7844E4] px-4 py-1.5 text-xs font-bold">Satın Al</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 bg-[#E1306C] py-4 text-center text-sm font-semibold text-white">
          <span className="live-dot h-2.5 w-2.5 rounded-full bg-white" />
          Sitemizde Anlık Olarak <strong className="mx-1">47 Kişi</strong> Alışveriş Yapıyor
        </div>
      </div>
    </section>
  )
}
