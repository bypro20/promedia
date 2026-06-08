import Link from 'next/link'

const SLIDES = [
  {
    id: 'tiktok',
    head: 'TikTok Paketlerini Keşfedin',
    title: 'Keşfedin',
    titleColor: '#057EF6',
    desc: 'TikTok hizmetlerimizi kullanarak dünyanın en büyük sosyal medya platformlarından birinde daha görünür olun!',
    cardBg: '#E3F1FE',
    linkColor: '#057EF6',
    links: [
      { label: 'Tiktok Takipçi', href: '/tiktok-takipci-satin-al' },
      { label: 'Tiktok Beğeni', href: '/tiktok-begeni-satin-al' },
      { label: 'TikTok İzlenme', href: '/tiktok-izlenme-satin-al' },
      { label: 'Tiktok Keşfet Açma', href: '/tiktok-izlenme-satin-al' },
    ],
  },
  {
    id: 'free',
    head: 'Ücretsiz Araçlarımızı İnceleyin',
    title: 'İnceleyin',
    titleColor: '#FD5501',
    desc: 'Ücretsiz araçlarımızla sosyal medyada takipçi ve etkileşim arttırmaya başlayın!',
    cardBg: '#FFECDF',
    linkColor: '#FD5501',
    links: [
      { label: 'Hashtag Oluşturucu', href: '/ucretsiz-araclar/hashtag-olusturucu' },
      { label: 'Bio Oluşturucu', href: '/ucretsiz-araclar/bio-olusturucu' },
      { label: 'Büyüme Hesaplayıcı', href: '/ucretsiz-araclar/takipci-hesaplayici' },
      { label: 'Tüm Araçlar', href: '/ucretsiz-araclar' },
    ],
  },
]

export function HeroSlides() {
  return (
    <section className="bg-[#F0F1F9] py-6">
      <div className="sd-container grid gap-4 md:grid-cols-2">
        {SLIDES.map((slide) => (
          <div key={slide.id} className="rounded-2xl bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
            <p className="text-sm font-semibold text-[#33353E]">{slide.head}</p>
            <p className="mt-1 text-2xl font-semibold" style={{ color: slide.titleColor }}>{slide.title}</p>
            <p className="mt-2 text-sm text-[#7A7F99]">{slide.desc}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {slide.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-[14px] px-3 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{ backgroundColor: slide.cardBg, color: slide.linkColor }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
