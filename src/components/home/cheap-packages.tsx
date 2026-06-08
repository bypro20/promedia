import Link from 'next/link'

const CHEAP = [
  { title: '100 Ucuz Global Takipçi', platform: 'INSTAGRAM', price: '14,90', href: '/instagram-ucuz-takipci-satin-al', color: '#E1306C', badge: 'EN UCUZ' },
  { title: '500 Ucuz Global Beğeni', platform: 'INSTAGRAM', price: '9,90', href: '/instagram-ucuz-begeni-satin-al', color: '#E1306C', badge: 'UCUZ' },
  { title: '100 Ucuz Global Takipçi', platform: 'TIKTOK', price: '12,90', href: '/tiktok-ucuz-takipci-satin-al', color: '#000000', badge: 'EN UCUZ' },
  { title: '1000 Ucuz Global İzlenme', platform: 'TIKTOK', price: '8,90', href: '/tiktok-ucuz-izlenme-satin-al', color: '#000000', badge: 'UCUZ' },
  { title: '100 Ucuz Global Abone', platform: 'YOUTUBE', price: '19,90', href: '/youtube-ucuz-abone-satin-al', color: '#FF0000', badge: 'EN UCUZ' },
  { title: '100 Global Takipçi', platform: 'INSTAGRAM', price: '29,90', href: '/instagram-takipci-satin-al', color: '#3382FA', badge: 'GLOBAL' },
  { title: '250 Türk Takipçi', platform: 'INSTAGRAM', price: '139,90', href: '/instagram-turk-takipci-satin-al', color: '#FD5501', badge: 'TÜRK' },
  { title: '100 Ucuz Global Takipçi', platform: 'TWITTER', price: '11,90', href: '/twitter-ucuz-takipci-satin-al', color: '#1DA1F2', badge: 'EN UCUZ' },
]

export function CheapPackages() {
  return (
    <section className="py-12" style={{ background: 'linear-gradient(180deg,#EDE5FF 0%,#F0F1F9 100%)' }}>
      <div className="sd-container">
        <div className="text-center">
          <span className="inline-block rounded-full bg-[#10B981] px-4 py-1 text-xs font-black uppercase text-white">
            Bütçe Dostu
          </span>
          <h2 className="mt-3 text-[26px] font-black text-[#33353E]">
            Ucuz & <span className="text-[#10B981]">Global Paketler</span>
          </h2>
          <p className="mt-1 text-[15px] font-semibold text-[#666F94]">
            En uygun fiyatlarla global takipçi, beğeni ve izlenme — anında başlangıç
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CHEAP.map((pkg) => (
            <Link
              key={pkg.title + pkg.platform}
              href={pkg.href}
              className="group relative overflow-hidden rounded-[20px] bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-all hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="absolute left-0 top-0 h-1.5 w-full" style={{ backgroundColor: pkg.color }} />
              <span
                className="rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase text-white"
                style={{ backgroundColor: pkg.color }}
              >
                {pkg.badge}
              </span>
              <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-[#7A7F99]">{pkg.platform}</p>
              <p className="mt-1 text-base font-black leading-snug text-[#33353E] group-hover:underline">{pkg.title}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xl font-black" style={{ color: pkg.color }}>{pkg.price} ₺</span>
                <span className="rounded-full px-3 py-1.5 text-xs font-bold text-white" style={{ backgroundColor: pkg.color }}>
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
