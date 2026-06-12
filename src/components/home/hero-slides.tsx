import Link from 'next/link'
import { FadeIn } from '@/components/ui/fade-in'

const SLIDES = [
  {
    id: 'tiktok',
    head: 'TikTok Paketlerini',
    title: 'Keşfedin',
    titleColor: '#057EF6',
    desc: 'TikTok hizmetlerimizi kullanarak dünyanın en büyük sosyal medya platformlarından birinde daha görünür olun!',
    cardBg: '#E3F1FE',
    linkColor: '#057EF6',
    href: '/tiktok-takipci-satin-al',
    links: [
      { label: 'TikTok Takipçi', href: '/tiktok-takipci-satin-al' },
      { label: 'TikTok Beğeni', href: '/tiktok-begeni-satin-al' },
      { label: 'TikTok İzlenme', href: '/tiktok-izlenme-satin-al' },
      { label: 'Tüm TikTok Hizmetleri', href: '/hizmetler' },
    ],
  },
  {
    id: 'free',
    head: 'Ücretsiz Araçlarımızı',
    title: 'İnceleyin',
    titleColor: '#FD5501',
    desc: 'Ücretsiz araçlarımızla sosyal medyada takipçi ve etkileşim arttırmaya başlayın!',
    cardBg: '#FFECDF',
    linkColor: '#FD5501',
    href: '/ucretsiz-araclar',
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
    <section className="bg-[#F0F1F9] pb-6">
      <div className="sd-container grid gap-4 md:grid-cols-2">
        {SLIDES.map((slide, i) => (
          <FadeIn key={slide.id} delay={i * 100}>
            <Link
              href={slide.href}
              className="group flex items-center justify-between rounded-2xl bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_8px_32px_rgba(120,68,228,0.12)] md:block"
            >
              <div>
                <p className="text-sm font-semibold text-[#33353E]">
                  {slide.head}{' '}
                  <span className="text-xl font-semibold" style={{ color: slide.titleColor }}>
                    {slide.title}
                  </span>
                </p>
                <p className="mt-2 hidden text-sm text-[#7A7F99] md:block">{slide.desc}</p>
                <div className="mt-4 hidden flex-wrap gap-2 md:flex">
                  {slide.links.map((link) => (
                    <span
                      key={link.label}
                      className="rounded-[14px] px-3 py-2 text-sm font-semibold"
                      style={{ backgroundColor: slide.cardBg, color: slide.linkColor }}
                    >
                      {link.label}
                    </span>
                  ))}
                </div>
              </div>
              <span className="ml-3 shrink-0 text-2xl opacity-70 transition-transform group-hover:scale-110 md:hidden" aria-hidden>
                👆
              </span>
            </Link>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
