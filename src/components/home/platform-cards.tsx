import Link from 'next/link'
import { ScrollRow } from '@/components/ui/scroll-row'
import { FadeIn } from '@/components/ui/fade-in'
import { PlatformLogo } from '@/components/platform-logo'

const PLATFORMS = [
  { name: 'Instagram', sub: 'Hizmetleri', href: '/instagram-takipci-satin-al', bg: '#E1306C', text: '#fff' },
  { name: 'TikTok', sub: 'Hizmetleri', href: '/tiktok-takipci-satin-al', bg: '#000000', text: '#fff' },
  { name: 'Twitter (X)', sub: 'Hizmetleri', href: '/twitter-takipci-satin-al', bg: '#1DA1F2', text: '#fff' },
  { name: 'Youtube', sub: 'Hizmetleri', href: '/youtube-abone-satin-al', bg: '#FF0000', text: '#fff' },
  { name: 'Facebook', sub: 'Hizmetleri', href: '/facebook-takipci-satin-al', bg: '#4267B2', text: '#fff' },
  { name: 'Telegram', sub: 'Hizmetleri', href: '/telegram-uye-satin-al', bg: '#0088CC', text: '#fff' },
  { name: 'Spotify', sub: 'Hizmetleri', href: '/spotify-takipci-satin-al', bg: '#1DB954', text: '#fff' },
  { name: 'Threads', sub: 'Hizmetleri', href: '/threads-takipci-satin-al', bg: '#000000', text: '#fff' },
  { name: 'Twitch', sub: 'Hizmetleri', href: '/twitch-takipci-satin-al', bg: '#9146FF', text: '#fff' },
  { name: 'Discord', sub: 'Hizmetleri', href: '/discord-uye-satin-al', bg: '#5865F2', text: '#fff' },
  { name: 'LinkedIn', sub: 'Hizmetleri', href: '/linkedin-takipci-satin-al', bg: '#0077B5', text: '#fff' },
  { name: 'Pinterest', sub: 'Hizmetleri', href: '/pinterest-takipci-satin-al', bg: '#E60023', text: '#fff' },
  { name: 'Kick', sub: 'Hizmetleri', href: '/kick-takipci-satin-al', bg: '#53FC18', text: '#000' },
  { name: 'SoundCloud', sub: 'Hizmetleri', href: '/soundcloud-takipci-satin-al', bg: '#FF5500', text: '#fff' },
]

export function PlatformCards() {
  return (
    <section className="overflow-hidden py-12">
      <div className="sd-container">
        <FadeIn>
          <div className="text-center">
            <h2 className="text-[26px] font-black text-[#33353E]">
              Sosyal Medya <span className="text-[#7A2CC7]">Hizmetlerimiz</span>
            </h2>
            <p className="mt-1 text-[15px] font-semibold text-[#666F94]">
              14 platform · 75+ satışa hazır hizmet kategorisi
            </p>
          </div>
        </FadeIn>

        <ScrollRow className="mt-8" desktopGrid="lg:grid-cols-4 xl:grid-cols-7">
          {PLATFORMS.map((p, i) => (
            <FadeIn key={p.name} delay={i * 50}>
            <Link
              href={p.href}
              className="sd-card-hover flex h-[75px] min-w-[217px] items-center gap-3 rounded-[18px] px-4 lg:min-w-0"
              style={{ backgroundColor: p.bg, color: p.text }}
            >
              <PlatformLogo platform={p.name.replace(' (X)', '').replace('Youtube', 'YouTube')} size={28} />
              <div>
                <span className="block text-base font-semibold leading-tight">{p.name}</span>
                <span className="text-xs opacity-90">{p.sub}</span>
              </div>
            </Link>
            </FadeIn>
          ))}
        </ScrollRow>
      </div>
    </section>
  )
}
