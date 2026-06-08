import { buildFourTiers, buildFaq, type ServiceDefinition, type PackageTier, type ServiceAudience } from './packages'
import { getPlatformColor } from './platform-colors'

type Svc = {
  key: string
  name: string
  unit: string
  base: number
  defaultTier?: PackageTier
  inputLabel?: string
  inputPrefix?: string
  audience?: ServiceAudience
  isTurk?: boolean
}

type Platform = { slug: string; name: string; icon: string; gradient: string; services: Svc[] }

const PLATFORMS: Platform[] = [
  {
    slug: 'instagram', name: 'Instagram', icon: '📸', gradient: 'from-[#f58529] via-[#dd2a7b] to-[#8134af]',
    services: [
      { key: 'ucuz-takipci', name: 'Ucuz Global Takipçi', unit: 'Takipçi', base: 49, defaultTier: 'ucuz', audience: 'ucuz' },
      { key: 'takipci', name: 'Global Takipçi', unit: 'Takipçi', base: 89, audience: 'global' },
      { key: 'turk-takipci', name: 'Türk Takipçi', unit: 'Türk Takipçi', base: 129, audience: 'turk', isTurk: true },
      { key: 'ucuz-begeni', name: 'Ucuz Global Beğeni', unit: 'Beğeni', base: 12, defaultTier: 'ucuz', audience: 'ucuz' },
      { key: 'begeni', name: 'Global Beğeni', unit: 'Beğeni', base: 29, audience: 'global' },
      { key: 'turk-begeni', name: 'Organik Türk Beğeni', unit: 'Türk Beğeni', base: 45, audience: 'turk', isTurk: true },
      { key: 'ucuz-izlenme', name: 'Ucuz Global İzlenme', unit: 'İzlenme', base: 8, defaultTier: 'ucuz', audience: 'ucuz' },
      { key: 'izlenme', name: 'Video İzlenme', unit: 'İzlenme', base: 15, audience: 'global' },
      { key: 'reels-izlenme', name: 'Reels İzlenme', unit: 'İzlenme', base: 18, audience: 'global' },
      { key: 'hikaye-izlenme', name: 'Hikaye İzlenme', unit: 'İzlenme', base: 12, audience: 'global' },
      { key: 'yorum', name: 'Global Yorum', unit: 'Yorum', base: 49, audience: 'global' },
      { key: 'turk-yorum', name: 'Gerçek Türk Yorum', unit: 'Türk Yorum', base: 69, audience: 'turk', isTurk: true },
      { key: 'kaydetme', name: 'Kaydetme', unit: 'Kaydetme', base: 35, audience: 'global' },
      { key: 'etkilesim', name: 'Etkileşim', unit: 'Etkileşim', base: 55, audience: 'global' },
      { key: 'otomatik-begeni', name: 'Otomatik Beğeni', unit: 'Beğeni', base: 79, audience: 'global' },
    ],
  },
  {
    slug: 'tiktok', name: 'TikTok', icon: '🎵', gradient: 'from-gray-900 to-pink-500',
    services: [
      { key: 'ucuz-takipci', name: 'Ucuz Global Takipçi', unit: 'Takipçi', base: 45, defaultTier: 'ucuz', audience: 'ucuz' },
      { key: 'takipci', name: 'Global Takipçi', unit: 'Takipçi', base: 79, audience: 'global' },
      { key: 'turk-takipci', name: 'Türk Takipçi', unit: 'Türk Takipçi', base: 119, audience: 'turk', isTurk: true },
      { key: 'ucuz-begeni', name: 'Ucuz Global Beğeni', unit: 'Beğeni', base: 10, defaultTier: 'ucuz', audience: 'ucuz' },
      { key: 'begeni', name: 'Global Beğeni', unit: 'Beğeni', base: 22, audience: 'global' },
      { key: 'turk-begeni', name: 'Türk Beğeni', unit: 'Türk Beğeni', base: 35, audience: 'turk', isTurk: true },
      { key: 'ucuz-izlenme', name: 'Ucuz Global İzlenme', unit: 'İzlenme', base: 6, defaultTier: 'ucuz', audience: 'ucuz' },
      { key: 'izlenme', name: 'İzlenme', unit: 'İzlenme', base: 12, audience: 'global' },
      { key: 'paylasim', name: 'Paylaşım', unit: 'Paylaşım', base: 29, audience: 'global' },
      { key: 'kaydet', name: 'Kaydet', unit: 'Kaydetme', base: 25, audience: 'global' },
      { key: 'otomatik-begeni', name: 'Otomatik Beğeni', unit: 'Beğeni', base: 65, audience: 'global' },
      { key: 'otomatik-izlenme', name: 'Otomatik İzlenme', unit: 'İzlenme', base: 55, audience: 'global' },
    ],
  },
  {
    slug: 'youtube', name: 'YouTube', icon: '▶️', gradient: 'from-red-700 to-red-500',
    services: [
      { key: 'ucuz-abone', name: 'Ucuz Global Abone', unit: 'Abone', base: 79, defaultTier: 'ucuz', audience: 'ucuz' },
      { key: 'abone', name: 'Global Abone', unit: 'Abone', base: 149, audience: 'global' },
      { key: 'turk-abone', name: 'Türk Abone', unit: 'Türk Abone', base: 199, audience: 'turk', isTurk: true },
      { key: 'ucuz-begeni', name: 'Ucuz Global Beğeni', unit: 'Beğeni', base: 15, defaultTier: 'ucuz', audience: 'ucuz' },
      { key: 'begeni', name: 'Global Beğeni', unit: 'Beğeni', base: 35, audience: 'global' },
      { key: 'ucuz-izlenme', name: 'Ucuz Global İzlenme', unit: 'İzlenme', base: 9, defaultTier: 'ucuz', audience: 'ucuz' },
      { key: 'izlenme', name: 'İzlenme', unit: 'İzlenme', base: 18, audience: 'global' },
      { key: '4000-saat', name: '4000 Saat İzlenme', unit: 'Saat', base: 899, inputLabel: 'Kanal linki', inputPrefix: '', audience: 'global' },
      { key: 'shorts-begeni', name: 'Shorts Beğeni', unit: 'Beğeni', base: 28, audience: 'global' },
      { key: 'shorts-izlenme', name: 'Shorts İzlenme', unit: 'İzlenme', base: 15, audience: 'global' },
      { key: 'canli-izlenme', name: 'Canlı Yayın İzlenme', unit: 'İzlenme', base: 45, audience: 'global' },
      { key: 'yorum', name: 'Yorum', unit: 'Yorum', base: 55, audience: 'global' },
    ],
  },
  {
    slug: 'twitter', name: 'Twitter', icon: '🐦', gradient: 'from-sky-400 to-blue-600',
    services: [
      { key: 'ucuz-takipci', name: 'Ucuz Global Takipçi', unit: 'Takipçi', base: 39, defaultTier: 'ucuz', audience: 'ucuz' },
      { key: 'takipci', name: 'Global Takipçi', unit: 'Takipçi', base: 69, audience: 'global' },
      { key: 'turk-takipci', name: 'Organik Türk Takipçi', unit: 'Türk Takipçi', base: 109, audience: 'turk', isTurk: true },
      { key: 'begeni', name: 'Global Beğeni', unit: 'Beğeni', base: 25, audience: 'global' },
      { key: 'turk-begeni', name: 'Türk Beğeni', unit: 'Türk Beğeni', base: 39, audience: 'turk', isTurk: true },
      { key: 'retweet', name: 'ReTweet', unit: 'ReTweet', base: 35, audience: 'global' },
      { key: 'izlenme', name: 'Tweet Görüntülenme', unit: 'Görüntülenme', base: 15, audience: 'global' },
      { key: 'yorum', name: 'Yorum', unit: 'Yorum', base: 45, audience: 'global' },
    ],
  },
  {
    slug: 'facebook', name: 'Facebook', icon: '👍', gradient: 'from-blue-600 to-blue-800',
    services: [
      { key: 'ucuz-takipci', name: 'Ucuz Global Takipçi', unit: 'Takipçi', base: 49, defaultTier: 'ucuz', audience: 'ucuz' },
      { key: 'takipci', name: 'Global Takipçi', unit: 'Takipçi', base: 85, audience: 'global' },
      { key: 'profil-takipci', name: 'Profil Takipçi', unit: 'Takipçi', base: 95, audience: 'global' },
      { key: 'begeni', name: 'Global Beğeni', unit: 'Beğeni', base: 35, audience: 'global' },
      { key: 'sayfa-begeni', name: 'Sayfa Beğenisi', unit: 'Beğeni', base: 45, audience: 'global' },
      { key: 'turk-begeni', name: 'Türk Beğeni', unit: 'Türk Beğeni', base: 55, audience: 'turk', isTurk: true },
      { key: 'izlenme', name: 'Video İzlenme', unit: 'İzlenme', base: 18, audience: 'global' },
      { key: 'yorum', name: 'Yorum', unit: 'Yorum', base: 49, audience: 'global' },
    ],
  },
  {
    slug: 'telegram', name: 'Telegram', icon: '✈️', gradient: 'from-sky-400 to-blue-500',
    services: [
      { key: 'uye', name: 'Grup / Kanal Üyesi', unit: 'Üye', base: 59, inputLabel: 'Kanal linki', inputPrefix: '', audience: 'global' },
      { key: 'goruntulenme', name: 'Görüntülenme', unit: 'Görüntülenme', base: 15, inputLabel: 'Gönderi linki', inputPrefix: '', audience: 'global' },
      { key: 'reaksiyon', name: 'Reaksiyon', unit: 'Reaksiyon', base: 29, inputLabel: 'Gönderi linki', inputPrefix: '', audience: 'global' },
    ],
  },
  {
    slug: 'spotify', name: 'Spotify', icon: '🎧', gradient: 'from-green-500 to-green-700',
    services: [
      { key: 'takipci', name: 'Global Takipçi', unit: 'Takipçi', base: 79, inputLabel: 'Sanatçı linki', inputPrefix: '', audience: 'global' },
      { key: 'dinlenme', name: 'Dinlenme', unit: 'Dinlenme', base: 22, inputLabel: 'Şarkı linki', inputPrefix: '', audience: 'global' },
      { key: 'aylik-dinleyici', name: 'Aylık Dinleyici', unit: 'Dinleyici', base: 149, inputLabel: 'Sanatçı linki', inputPrefix: '', audience: 'global' },
      { key: 'kaydetme', name: 'Kaydetme', unit: 'Kaydetme', base: 35, inputLabel: 'Şarkı linki', inputPrefix: '', audience: 'global' },
    ],
  },
  {
    slug: 'linkedin', name: 'LinkedIn', icon: '💼', gradient: 'from-blue-700 to-blue-900',
    services: [
      { key: 'takipci', name: 'Global Takipçi', unit: 'Takipçi', base: 99, audience: 'global' },
      { key: 'begeni', name: 'Beğeni', unit: 'Beğeni', base: 45, audience: 'global' },
    ],
  },
  {
    slug: 'pinterest', name: 'Pinterest', icon: '📌', gradient: 'from-red-600 to-red-800',
    services: [
      { key: 'takipci', name: 'Global Takipçi', unit: 'Takipçi', base: 75, audience: 'global' },
      { key: 'begeni', name: 'Beğeni', unit: 'Beğeni', base: 35, audience: 'global' },
    ],
  },
  {
    slug: 'twitch', name: 'Twitch', icon: '🎮', gradient: 'from-purple-700 to-purple-900',
    services: [
      { key: 'takipci', name: 'Global Takipçi', unit: 'Takipçi', base: 89, audience: 'global' },
      { key: 'izlenme', name: 'İzlenme', unit: 'İzlenme', base: 25, audience: 'global' },
    ],
  },
  {
    slug: 'discord', name: 'Discord', icon: '💬', gradient: 'from-indigo-600 to-indigo-800',
    services: [{ key: 'uye', name: 'Sunucu Üyesi', unit: 'Üye', base: 69, inputLabel: 'Davet linki', inputPrefix: '', audience: 'global' }],
  },
  {
    slug: 'threads', name: 'Threads', icon: '🧵', gradient: 'from-gray-800 to-gray-950',
    services: [
      { key: 'takipci', name: 'Global Takipçi', unit: 'Takipçi', base: 79, audience: 'global' },
      { key: 'begeni', name: 'Beğeni', unit: 'Beğeni', base: 29, audience: 'global' },
    ],
  },
  {
    slug: 'kick', name: 'Kick', icon: '🟢', gradient: 'from-green-400 to-green-600',
    services: [
      { key: 'takipci', name: 'Global Takipçi', unit: 'Takipçi', base: 85, audience: 'global' },
      { key: 'izlenme', name: 'İzlenme', unit: 'İzlenme', base: 28, audience: 'global' },
    ],
  },
  {
    slug: 'soundcloud', name: 'SoundCloud', icon: '☁️', gradient: 'from-orange-500 to-orange-700',
    services: [
      { key: 'takipci', name: 'Global Takipçi', unit: 'Takipçi', base: 75, audience: 'global' },
      { key: 'dinlenme', name: 'Dinlenme', unit: 'Dinlenme', base: 20, inputLabel: 'Parça linki', inputPrefix: '', audience: 'global' },
    ],
  },
]

function makeService(p: Platform, s: Svc): ServiceDefinition {
  const slug = `${p.slug}-${s.key}-satin-al`
  const prefix = slug.replace(/-/g, '').slice(0, 6)
  const colors = getPlatformColor(p.slug)
  return {
    slug,
    platform: p.name,
    platformSlug: p.slug,
    title: `${p.name} ${s.name} Satın Al`,
    unit: s.unit,
    inputLabel: s.inputLabel ?? `${p.name} kullanıcı adı`,
    inputPrefix: s.inputPrefix ?? '@',
    heroGradient: p.gradient,
    platformIcon: p.icon,
    platformColor: colors.primary,
    platformColorLight: colors.light,
    audience: s.audience ?? 'global',
    defaultTier: s.defaultTier ?? 'standart',
    tiers: buildFourTiers(prefix, s.base, s.unit, s.isTurk ?? false),
    faq: buildFaq(p.name, s.unit),
  }
}

export const ALL_SERVICES = PLATFORMS.flatMap((p) => p.services.map((s) => makeService(p, s)))
export const SERVICE_COUNT = ALL_SERVICES.length

export function getService(slug: string) {
  return ALL_SERVICES.find((s) => s.slug === slug)
}

export function getAllSlugs() {
  return ALL_SERVICES.map((s) => s.slug)
}

export function getPlatformGroups() {
  return PLATFORMS.map((p) => {
    const colors = getPlatformColor(p.slug)
    return {
      platform: p.name,
      slug: p.slug,
      icon: p.icon,
      color: p.gradient,
      primary: colors.primary,
      light: colors.light,
      items: p.services.map((s) => ({
        name: `${p.name} ${s.name}`,
        href: `/${p.slug}-${s.key}-satin-al`,
        audience: s.audience ?? 'global',
      })),
    }
  })
}

export const PLATFORM_SERVICES = getPlatformGroups()

export function getAudienceLabel(audience: ServiceAudience): string {
  switch (audience) {
    case 'ucuz': return 'Ucuz Global'
    case 'turk': return 'Türk'
    case 'global': return 'Global'
    default: return 'Tümü'
  }
}

export function getAudienceBadgeColor(audience: ServiceAudience): string {
  switch (audience) {
    case 'ucuz': return '#10B981'
    case 'turk': return '#FD5501'
    case 'global': return '#3382FA'
    default: return '#7844E4'
  }
}
