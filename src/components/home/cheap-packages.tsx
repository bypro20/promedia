import Link from 'next/link'
import { FadeIn } from '@/components/ui/fade-in'
import { PackageCardArt, type PackageServiceKind } from '@/components/package-card-art'
import { PlatformLogo } from '@/components/platform-logo'
import { getPackagePriceLabel } from '@/lib/featured-packages'
import type { PackageTier } from '@/lib/packages'

const CHEAP_DEF = [
  { title: '100 Ucuz Global Takipçi', platform: 'INSTAGRAM', slug: '/instagram-ucuz-takipci-satin-al', tier: 'ucuz' as PackageTier, amount: 100, color: '#E1306C', badge: 'EN UCUZ', kind: 'followers' as PackageServiceKind },
  { title: '500 Ucuz Global Beğeni', platform: 'INSTAGRAM', slug: '/instagram-ucuz-begeni-satin-al', tier: 'ucuz' as PackageTier, amount: 500, color: '#E1306C', badge: 'UCUZ', kind: 'likes' as PackageServiceKind },
  { title: '100 Ucuz Global Takipçi', platform: 'TIKTOK', slug: '/tiktok-ucuz-takipci-satin-al', tier: 'ucuz' as PackageTier, amount: 100, color: '#000000', badge: 'EN UCUZ', kind: 'followers' as PackageServiceKind },
  { title: '1000 Ucuz Global İzlenme', platform: 'TIKTOK', slug: '/tiktok-ucuz-izlenme-satin-al', tier: 'ucuz' as PackageTier, amount: 1000, color: '#000000', badge: 'UCUZ', kind: 'views' as PackageServiceKind },
  { title: '100 Ucuz Global Abone', platform: 'YOUTUBE', slug: '/youtube-ucuz-abone-satin-al', tier: 'ucuz' as PackageTier, amount: 100, color: '#FF0000', badge: 'EN UCUZ', kind: 'subscribers' as PackageServiceKind },
  { title: '100 Global Takipçi', platform: 'INSTAGRAM', slug: '/instagram-takipci-satin-al', tier: 'standart' as PackageTier, amount: 100, color: '#3382FA', badge: 'GLOBAL', kind: 'followers' as PackageServiceKind },
  { title: '250 Türk Takipçi', platform: 'INSTAGRAM', slug: '/instagram-turk-takipci-satin-al', tier: 'standart' as PackageTier, amount: 250, color: '#FD5501', badge: 'TÜRK', kind: 'followers' as PackageServiceKind },
  { title: '100 Ucuz Global Takipçi', platform: 'TWITTER', slug: '/twitter-ucuz-takipci-satin-al', tier: 'ucuz' as PackageTier, amount: 100, color: '#1DA1F2', badge: 'EN UCUZ', kind: 'followers' as PackageServiceKind },
]

const CHEAP = CHEAP_DEF.map((pkg) => ({
  ...pkg,
  href: pkg.slug,
  price: getPackagePriceLabel(pkg.slug.slice(1), pkg.tier, pkg.amount),
}))

export function CheapPackages() {
  return (
    <section className="py-12" style={{ background: 'linear-gradient(180deg,#EDE5FF 0%,#F0F1F9 100%)' }}>
      <div className="sd-container">
        <FadeIn>
          <div className="text-center">
            <span className="sd-shimmer-badge inline-block rounded-full bg-[#10B981] px-4 py-1 text-xs font-black uppercase text-white">
              Bütçe Dostu
            </span>
            <h2 className="mt-3 text-[26px] font-black text-[#33353E]">
              Ucuz & <span className="text-[#10B981]">Global Paketler</span>
            </h2>
            <p className="mt-1 text-[15px] font-semibold text-[#666F94]">
              En uygun fiyatlarla global takipçi, beğeni ve izlenme — anında başlangıç
            </p>
          </div>
        </FadeIn>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CHEAP.map((pkg, i) => (
            <FadeIn key={pkg.title + pkg.platform + pkg.kind} delay={i * 60}>
              <Link
                href={pkg.href}
                className="sd-card-hover group relative flex h-full flex-col overflow-hidden rounded-[20px] bg-white p-5 shadow-[0_4px_24px_rgba(120,68,228,0.08)]"
              >
                <div className="absolute left-0 top-0 h-1.5 w-full" style={{ backgroundColor: pkg.color }} />
                <PackageCardArt platform={pkg.platform} kind={pkg.kind} accent={pkg.color} />
                <div className="flex flex-wrap items-center gap-1.5">
                  <span
                    className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase text-white"
                    style={{ backgroundColor: pkg.color }}
                  >
                    {pkg.badge}
                  </span>
                  <div className="flex min-w-0 items-center gap-1">
                    <PlatformLogo platform={pkg.platform} size={16} />
                    <span className="truncate text-[10px] font-black uppercase tracking-wide text-[#7A7F99]">{pkg.platform}</span>
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 min-h-[2.75rem] flex-1 text-sm font-black leading-snug text-[#33353E] sm:text-base group-hover:underline">
                  {pkg.title}
                </p>
                <div className="mt-3 flex shrink-0 items-center justify-between gap-2 border-t border-[#E9EBF5] pt-3">
                  <span className="text-lg font-black whitespace-nowrap sm:text-xl" style={{ color: pkg.color }}>{pkg.price} ₺</span>
                  <span className="shrink-0 rounded-full px-3 py-1.5 text-xs font-bold text-white" style={{ backgroundColor: pkg.color }}>
                    Satın Al
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
