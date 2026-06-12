import Link from 'next/link'
import { ScrollRow } from '@/components/ui/scroll-row'
import { FadeIn } from '@/components/ui/fade-in'
import { PackageCardArt, inferPackageKind, type PackageServiceKind } from '@/components/package-card-art'
import { PlatformLogo } from '@/components/platform-logo'
import { getPackagePriceLabel } from '@/lib/featured-packages'
import type { PackageTier } from '@/lib/packages'

const FEATURED_DEF = [
  { badge: 'Çok Satanlar', badgeBg: '#7844E4', title: '180 Gün Garantili 250 Türk Takipçi', platform: 'INSTAGRAM', platformColor: '#E1306C', href: '/instagram-turk-takipci-satin-al', slug: 'instagram-turk-takipci-satin-al', tier: 'standart' as PackageTier, amount: 250, kind: 'followers' as PackageServiceKind },
  { badge: 'KOMBO', badgeBg: '#FD5501', title: 'Organik 80 Kadın Türk Beğeni', platform: 'INSTAGRAM', platformColor: '#E1306C', href: '/instagram-turk-begeni-satin-al', slug: 'instagram-turk-begeni-satin-al', tier: 'standart' as PackageTier, amount: 80, kind: 'likes' as PackageServiceKind },
  { badge: 'UCUZ', badgeBg: '#10B981', title: '100 Ucuz Global Takipçi', platform: 'INSTAGRAM', platformColor: '#E1306C', href: '/instagram-ucuz-takipci-satin-al', slug: 'instagram-ucuz-takipci-satin-al', tier: 'ucuz' as PackageTier, amount: 100, kind: 'followers' as PackageServiceKind },
  { badge: 'GLOBAL', badgeBg: '#3382FA', title: '10.000 Global Takipçi', platform: 'INSTAGRAM', platformColor: '#E1306C', href: '/instagram-takipci-satin-al', slug: 'instagram-takipci-satin-al', tier: 'standart' as PackageTier, amount: 10000, kind: 'followers' as PackageServiceKind },
]

const FEATURED = FEATURED_DEF.map((f) => ({
  ...f,
  price: getPackagePriceLabel(f.slug, f.tier, f.amount),
}))

const PACKAGE_DEF = [
  { title: '250 Türk Takipçi', platform: 'INSTAGRAM', slug: 'instagram-turk-takipci-satin-al', tier: 'standart' as PackageTier, amount: 250, color: '#E1306C', type: 'TÜRK' },
  { title: '5.000 Türk Takipçi', platform: 'INSTAGRAM', slug: 'instagram-turk-takipci-satin-al', tier: 'standart' as PackageTier, amount: 5000, color: '#E1306C', type: 'TÜRK', featured: true },
  { title: '500 Ucuz Global Beğeni', platform: 'INSTAGRAM', slug: 'instagram-ucuz-begeni-satin-al', tier: 'ucuz' as PackageTier, amount: 500, color: '#10B981', type: 'UCUZ' },
  { title: '1.000 TikTok Global Takipçi', platform: 'TIKTOK', slug: 'tiktok-takipci-satin-al', tier: 'standart' as PackageTier, amount: 1000, color: '#000', type: 'GLOBAL' },
  { title: '100 Ucuz TikTok Takipçi', platform: 'TIKTOK', slug: 'tiktok-ucuz-takipci-satin-al', tier: 'ucuz' as PackageTier, amount: 100, color: '#10B981', type: 'UCUZ' },
  { title: '1.000 YouTube Global Abone', platform: 'YOUTUBE', slug: 'youtube-abone-satin-al', tier: 'standart' as PackageTier, amount: 1000, color: '#FF0000', type: 'GLOBAL' },
  { title: '100 Ucuz YouTube Abone', platform: 'YOUTUBE', slug: 'youtube-ucuz-abone-satin-al', tier: 'ucuz' as PackageTier, amount: 100, color: '#10B981', type: 'UCUZ' },
  { title: '500 Twitter Global Takipçi', platform: 'TWITTER', slug: 'twitter-takipci-satin-al', tier: 'standart' as PackageTier, amount: 500, color: '#1DA1F2', type: 'GLOBAL' },
]

const PACKAGES = PACKAGE_DEF.map((pkg) => ({
  ...pkg,
  href: `/${pkg.slug}`,
  price: getPackagePriceLabel(pkg.slug, pkg.tier, pkg.amount),
  kind: inferPackageKind(pkg.title),
}))

export function PopularPackages() {
  return (
    <section className="overflow-hidden bg-white py-12">
      <div className="sd-container">
        <FadeIn>
          <div className="text-center">
            <h2 className="text-[26px] font-black text-[#33353E]">
              Sosyal Medya <span className="text-[#E1306C]">Paketlerimiz</span>
            </h2>
            <p className="mt-1 text-[15px] font-semibold text-[#666F94]">Global · Türk · Ucuz — en çok tercih edilen paketler</p>
          </div>
        </FadeIn>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="sd-card-hover relative flex h-full flex-col overflow-hidden rounded-[20px] bg-[#282D40] px-5 py-4 text-white transition-transform hover:scale-[1.02]"
            >
              <div className="absolute left-0 top-0 h-1 w-full" style={{ backgroundColor: f.platformColor }} />
              <PackageCardArt platform={f.platform} kind={f.kind} accent={f.platformColor} variant="dark" />
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase text-white" style={{ backgroundColor: f.badgeBg }}>
                  {f.badge}
                </span>
                <div className="flex min-w-0 items-center gap-1">
                  <PlatformLogo platform={f.platform} size={16} />
                  <span className="truncate text-[10px] font-black uppercase tracking-wide text-white/50">{f.platform}</span>
                </div>
              </div>
              <p className="mt-2 line-clamp-2 min-h-[2.75rem] flex-1 text-sm font-bold leading-snug sm:text-base">{f.title}</p>
              <div className="mt-3 flex shrink-0 items-center justify-between gap-2 border-t border-white/10 pt-3">
                <span className="text-lg font-black whitespace-nowrap sm:text-xl">{f.price} ₺</span>
                <span className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-xs font-bold">Satın Al</span>
              </div>
            </Link>
          ))}
        </div>

        <ScrollRow className="mt-4" desktopGrid="lg:grid-cols-2 xl:grid-cols-4">
          {PACKAGES.map((pkg) => (
            <Link
              key={pkg.title}
              href={pkg.href}
              className={`sd-card-hover flex min-w-[260px] flex-col justify-between rounded-[20px] bg-[#282D40] p-5 text-white transition-transform hover:scale-[1.02] lg:min-w-0 ${pkg.featured ? 'ring-2 ring-[#7844E4]' : ''}`}
            >
              <div className="flex min-h-0 flex-1 flex-col">
                <PackageCardArt platform={pkg.platform} kind={pkg.kind} accent={pkg.color} variant="dark" />
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-black uppercase text-white" style={{ backgroundColor: pkg.color }}>
                    {pkg.type}
                  </span>
                  {pkg.featured && (
                    <span className="shrink-0 rounded-full bg-[#10B981] px-2 py-0.5 text-[9px] font-black uppercase">Öne Çıkan</span>
                  )}
                </div>
                <div className="mt-2 flex min-w-0 items-center gap-1.5">
                  <PlatformLogo platform={pkg.platform} size={16} />
                  <p className="truncate text-[10px] font-black uppercase tracking-wide text-[#BFA0FF]">{pkg.platform}</p>
                </div>
                <p className="mt-1 line-clamp-2 min-h-[2.5rem] flex-1 text-sm font-bold leading-snug">{pkg.title}</p>
              </div>
              <div className="mt-4 flex shrink-0 items-center justify-between gap-2 border-t border-white/10 pt-3">
                <span className="text-lg font-black whitespace-nowrap sm:text-xl">{pkg.price} ₺</span>
                <span className="shrink-0 rounded-full px-4 py-1.5 text-xs font-black text-white" style={{ backgroundColor: pkg.color }}>
                  Satın Al
                </span>
              </div>
            </Link>
          ))}
        </ScrollRow>

        <div className="mt-6 overflow-hidden rounded-xl">
          <div className="flex items-center justify-center gap-2 py-4 text-center text-sm font-bold text-white" style={{ backgroundColor: '#7844E4' }}>
            <span className="live-dot h-2.5 w-2.5 rounded-full bg-white" />
            75+ hizmet · 3D Secure · iyzico güvenli ödeme · Telafi garantili
          </div>
        </div>
      </div>
    </section>
  )
}
