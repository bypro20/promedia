import Link from 'next/link'

const PACKAGES = [
  { badge: 'Çok Satan', badgeClass: 'badge-coksatan', platform: 'INSTAGRAM', title: '180 Gün Garantili 250 Türk Takipçi', price: '139,90', href: '/instagram-turk-takipci-satin-al' },
  { badge: 'KOMBO', badgeClass: 'badge-kombo', platform: 'INSTAGRAM', title: 'Organik 80 Türk Beğeni', price: '49,90', href: '/instagram-turk-begeni-satin-al' },
  { badge: 'Öne Çıkan', badgeClass: 'badge-onecikan', platform: 'INSTAGRAM', title: '5.000 Türk Takipçi', price: '549,90', href: '/instagram-turk-takipci-satin-al', featured: true },
  { badge: 'Çok Satan', badgeClass: 'badge-coksatan', platform: 'TIKTOK', title: '1.000 TikTok Takipçi', price: '79,90', href: '/tiktok-takipci-satin-al' },
  { badge: 'KOMBO', badgeClass: 'badge-kombo', platform: 'YOUTUBE', title: '1.000 YouTube Abone', price: '149,90', href: '/youtube-abone-satin-al' },
  { badge: 'Çok Satan', badgeClass: 'badge-coksatan', platform: 'INSTAGRAM', title: '10.000 Global Takipçi', price: '999,90', href: '/instagram-takipci-satin-al' },
]

export function PopularPackages() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-black sm:text-3xl">Sosyal Medya Paketlerimiz</h2>
          <p className="mt-1 text-muted">Sosyal medyada en çok ilgi gören hizmetlerimiz</p>
        </div>

        {/* Canlı alışveriş bandı */}
        <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2 rounded-full bg-green/10 px-4 py-2 text-sm font-semibold text-green">
          <span className="live-dot h-2.5 w-2.5 rounded-full bg-green" />
          Sitemizde anlık olarak <strong>47 kişi</strong> alışveriş yapıyor
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PACKAGES.map((pkg) => (
            <Link
              key={pkg.title}
              href={pkg.href}
              className={`sd-card group relative overflow-hidden p-5 ${pkg.featured ? 'ring-2 ring-purple' : ''}`}
            >
              <span className={`absolute right-4 top-4 rounded-full px-2.5 py-1 text-[10px] font-black uppercase text-white ${pkg.badgeClass}`}>
                {pkg.badge}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-purple">{pkg.platform}</span>
              <h3 className="mt-2 pr-16 text-base font-bold leading-snug group-hover:text-purple">{pkg.title}</h3>
              {pkg.featured && (
                <ul className="mt-3 space-y-1 text-xs text-muted">
                  <li>✓ Hızlı Teslimat</li>
                  <li>✓ Güvenli Ödeme</li>
                  <li>✓ 7/24 Destek</li>
                  <li>✓ Telafi Garantisi</li>
                </ul>
              )}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-2xl font-black text-purple">{pkg.price} ₺</span>
                <span className="rounded-full bg-purple-light px-4 py-2 text-xs font-bold text-purple group-hover:bg-purple group-hover:text-white">
                  Satın Al
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
