import Link from 'next/link'
import { ScrollRow } from '@/components/ui/scroll-row'

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
  { name: 'Diğer', sub: 'Hizmetler', href: '/hizmetler', bg: '#E2E5F1', text: '#33353E' },
]

export function PlatformCards() {
  return (
    <section className="overflow-hidden py-12">
      <div className="sd-container">
        <div className="text-center">
          <h2 className="text-[26px] font-semibold text-[#33353E]">
            Sosyal Medya <span className="text-[#7A2CC7]">Hizmetlerimiz</span>
          </h2>
          <p className="mt-1 text-[15px] font-medium text-[#666F94]">
            Sosyal medyada en çok ilgi gören hizmetlerimiz
          </p>
        </div>

        <ScrollRow className="mt-8" desktopGrid="lg:grid-cols-4 xl:grid-cols-6">
          {PLATFORMS.map((p) => (
            <Link
              key={p.name}
              href={p.href}
              className="flex h-[75px] min-w-[217px] flex-col justify-center rounded-[18px] px-5 transition-transform hover:scale-[1.02] lg:min-w-0"
              style={{ backgroundColor: p.bg, color: p.text }}
            >
              <span className="text-base font-semibold leading-tight">{p.name}</span>
              <span className="text-xs opacity-90">{p.sub}</span>
            </Link>
          ))}
        </ScrollRow>
      </div>
    </section>
  )
}
