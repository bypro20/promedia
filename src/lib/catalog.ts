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

/** Katalog taban fiyatları — 1000 birim başına ₺ (2026 güncel) */
const PLATFORMS: Platform[] = [
  {
    slug: 'instagram', name: 'Instagram', icon: '📸', gradient: 'from-[#f58529] via-[#dd2a7b] to-[#8134af]',
    services: [
      { key: 'ucuz-takipci', name: 'Ucuz Global Takipçi', unit: 'Takipçi', base: 62, defaultTier: 'ucuz', audience: 'ucuz' },
      { key: 'takipci', name: 'Global Takipçi', unit: 'Takipçi', base: 119, audience: 'global' },
      { key: 'turk-takipci', name: 'Türk Takipçi', unit: 'Türk Takipçi', base: 175, audience: 'turk', isTurk: true },
      { key: 'ucuz-begeni', name: 'Ucuz Global Beğeni', unit: 'Beğeni', base: 16, defaultTier: 'ucuz', audience: 'ucuz' },
      { key: 'begeni', name: 'Global Beğeni', unit: 'Beğeni', base: 39, audience: 'global' },
      { key: 'turk-begeni', name: 'Organik Türk Beğeni', unit: 'Türk Beğeni', base: 59, audience: 'turk', isTurk: true },
      { key: 'ucuz-izlenme', name: 'Ucuz Global İzlenme', unit: 'İzlenme', base: 11, defaultTier: 'ucuz', audience: 'ucuz' },
      { key: 'izlenme', name: 'Video İzlenme', unit: 'İzlenme', base: 21, audience: 'global' },
      { key: 'reels-izlenme', name: 'Reels İzlenme', unit: 'İzlenme', base: 24, audience: 'global' },
      { key: 'hikaye-izlenme', name: 'Hikaye İzlenme', unit: 'İzlenme', base: 16, audience: 'global' },
      { key: 'yorum', name: 'Global Yorum', unit: 'Yorum', base: 65, audience: 'global' },
      { key: 'turk-yorum', name: 'Gerçek Türk Yorum', unit: 'Türk Yorum', base: 89, audience: 'turk', isTurk: true },
      { key: 'kaydetme', name: 'Kaydetme', unit: 'Kaydetme', base: 46, audience: 'global' },
      { key: 'etkilesim', name: 'Etkileşim', unit: 'Etkileşim', base: 72, audience: 'global' },
      { key: 'otomatik-begeni', name: 'Otomatik Beğeni', unit: 'Beğeni', base: 105, audience: 'global' },
    ],
  },
  {
    slug: 'tiktok', name: 'TikTok', icon: '🎵', gradient: 'from-gray-900 to-pink-500',
    services: [
      { key: 'ucuz-takipci', name: 'Ucuz Global Takipçi', unit: 'Takipçi', base: 58, defaultTier: 'ucuz', audience: 'ucuz' },
      { key: 'takipci', name: 'Global Takipçi', unit: 'Takipçi', base: 105, audience: 'global' },
      { key: 'turk-takipci', name: 'Türk Takipçi', unit: 'Türk Takipçi', base: 159, audience: 'turk', isTurk: true },
      { key: 'ucuz-begeni', name: 'Ucuz Global Beğeni', unit: 'Beğeni', base: 14, defaultTier: 'ucuz', audience: 'ucuz' },
      { key: 'begeni', name: 'Global Beğeni', unit: 'Beğeni', base: 29, audience: 'global' },
      { key: 'turk-begeni', name: 'Türk Beğeni', unit: 'Türk Beğeni', base: 46, audience: 'turk', isTurk: true },
      { key: 'ucuz-izlenme', name: 'Ucuz Global İzlenme', unit: 'İzlenme', base: 8, defaultTier: 'ucuz', audience: 'ucuz' },
      { key: 'izlenme', name: 'İzlenme', unit: 'İzlenme', base: 16, audience: 'global' },
      { key: 'paylasim', name: 'Paylaşım', unit: 'Paylaşım', base: 38, audience: 'global' },
      { key: 'kaydet', name: 'Kaydet', unit: 'Kaydetme', base: 33, audience: 'global' },
      { key: 'otomatik-begeni', name: 'Otomatik Beğeni', unit: 'Beğeni', base: 85, audience: 'global' },
      { key: 'otomatik-izlenme', name: 'Otomatik İzlenme', unit: 'İzlenme', base: 72, audience: 'global' },
    ],
  },
  {
    slug: 'youtube', name: 'YouTube', icon: '▶️', gradient: 'from-red-700 to-red-500',
    services: [
      { key: 'ucuz-abone', name: 'Ucuz Global Abone', unit: 'Abone', base: 105, defaultTier: 'ucuz', audience: 'ucuz' },
      { key: 'abone', name: 'Global Abone', unit: 'Abone', base: 199, audience: 'global' },
      { key: 'turk-abone', name: 'Türk Abone', unit: 'Türk Abone', base: 269, audience: 'turk', isTurk: true },
      { key: 'ucuz-begeni', name: 'Ucuz Global Beğeni', unit: 'Beğeni', base: 20, defaultTier: 'ucuz', audience: 'ucuz' },
      { key: 'begeni', name: 'Global Beğeni', unit: 'Beğeni', base: 46, audience: 'global' },
      { key: 'ucuz-izlenme', name: 'Ucuz Global İzlenme', unit: 'İzlenme', base: 12, defaultTier: 'ucuz', audience: 'ucuz' },
      { key: 'izlenme', name: 'İzlenme', unit: 'İzlenme', base: 24, audience: 'global' },
      { key: '4000-saat', name: '4000 Saat İzlenme', unit: 'Saat', base: 1290, inputLabel: 'Kanal linki', inputPrefix: '', audience: 'global' },
      { key: 'shorts-begeni', name: 'Shorts Beğeni', unit: 'Beğeni', base: 38, audience: 'global' },
      { key: 'shorts-izlenme', name: 'Shorts İzlenme', unit: 'İzlenme', base: 20, audience: 'global' },
      { key: 'canli-izlenme', name: 'Canlı Yayın İzlenme', unit: 'İzlenme', base: 59, audience: 'global' },
      { key: 'yorum', name: 'Yorum', unit: 'Yorum', base: 72, audience: 'global' },
    ],
  },
  {
    slug: 'twitter', name: 'Twitter', icon: '🐦', gradient: 'from-sky-400 to-blue-600',
    services: [
      { key: 'ucuz-takipci', name: 'Ucuz Global Takipçi', unit: 'Takipçi', base: 52, defaultTier: 'ucuz', audience: 'ucuz' },
      { key: 'takipci', name: 'Global Takipçi', unit: 'Takipçi', base: 92, audience: 'global' },
      { key: 'turk-takipci', name: 'Organik Türk Takipçi', unit: 'Türk Takipçi', base: 145, audience: 'turk', isTurk: true },
      { key: 'begeni', name: 'Global Beğeni', unit: 'Beğeni', base: 33, audience: 'global' },
      { key: 'turk-begeni', name: 'Türk Beğeni', unit: 'Türk Beğeni', base: 52, audience: 'turk', isTurk: true },
      { key: 'retweet', name: 'ReTweet', unit: 'ReTweet', base: 46, audience: 'global' },
      { key: 'izlenme', name: 'Tweet Görüntülenme', unit: 'Görüntülenme', base: 20, audience: 'global' },
      { key: 'yorum', name: 'Yorum', unit: 'Yorum', base: 59, audience: 'global' },
    ],
  },
  {
    slug: 'facebook', name: 'Facebook', icon: '👍', gradient: 'from-blue-600 to-blue-800',
    services: [
      { key: 'ucuz-takipci', name: 'Ucuz Global Takipçi', unit: 'Takipçi', base: 65, defaultTier: 'ucuz', audience: 'ucuz' },
      { key: 'takipci', name: 'Global Takipçi', unit: 'Takipçi', base: 112, audience: 'global' },
      { key: 'profil-takipci', name: 'Profil Takipçi', unit: 'Takipçi', base: 125, audience: 'global' },
      { key: 'begeni', name: 'Global Beğeni', unit: 'Beğeni', base: 46, audience: 'global' },
      { key: 'sayfa-begeni', name: 'Sayfa Beğenisi', unit: 'Beğeni', base: 59, audience: 'global' },
      { key: 'turk-begeni', name: 'Türk Beğeni', unit: 'Türk Beğeni', base: 72, audience: 'turk', isTurk: true },
      { key: 'izlenme', name: 'Video İzlenme', unit: 'İzlenme', base: 24, audience: 'global' },
      { key: 'yorum', name: 'Yorum', unit: 'Yorum', base: 65, audience: 'global' },
    ],
  },
  {
    slug: 'telegram', name: 'Telegram', icon: '✈️', gradient: 'from-sky-400 to-blue-500',
    services: [
      { key: 'uye', name: 'Grup / Kanal Üyesi', unit: 'Üye', base: 79, inputLabel: 'Kanal linki', inputPrefix: '', audience: 'global' },
      { key: 'goruntulenme', name: 'Görüntülenme', unit: 'Görüntülenme', base: 20, inputLabel: 'Gönderi linki', inputPrefix: '', audience: 'global' },
      { key: 'reaksiyon', name: 'Reaksiyon', unit: 'Reaksiyon', base: 38, inputLabel: 'Gönderi linki', inputPrefix: '', audience: 'global' },
    ],
  },
  {
    slug: 'spotify', name: 'Spotify', icon: '🎧', gradient: 'from-green-500 to-green-700',
    services: [
      { key: 'takipci', name: 'Global Takipçi', unit: 'Takipçi', base: 105, inputLabel: 'Sanatçı linki', inputPrefix: '', audience: 'global' },
      { key: 'dinlenme', name: 'Dinlenme', unit: 'Dinlenme', base: 29, inputLabel: 'Şarkı linki', inputPrefix: '', audience: 'global' },
      { key: 'aylik-dinleyici', name: 'Aylık Dinleyici', unit: 'Dinleyici', base: 199, inputLabel: 'Sanatçı linki', inputPrefix: '', audience: 'global' },
      { key: 'kaydetme', name: 'Kaydetme', unit: 'Kaydetme', base: 46, inputLabel: 'Şarkı linki', inputPrefix: '', audience: 'global' },
    ],
  },
  {
    slug: 'linkedin', name: 'LinkedIn', icon: '💼', gradient: 'from-blue-700 to-blue-900',
    services: [
      { key: 'takipci', name: 'Global Takipçi', unit: 'Takipçi', base: 129, audience: 'global' },
      { key: 'begeni', name: 'Beğeni', unit: 'Beğeni', base: 59, audience: 'global' },
    ],
  },
  {
    slug: 'pinterest', name: 'Pinterest', icon: '📌', gradient: 'from-red-600 to-red-800',
    services: [
      { key: 'takipci', name: 'Global Takipçi', unit: 'Takipçi', base: 99, audience: 'global' },
      { key: 'begeni', name: 'Beğeni', unit: 'Beğeni', base: 46, audience: 'global' },
    ],
  },
  {
    slug: 'twitch', name: 'Twitch', icon: '🎮', gradient: 'from-purple-700 to-purple-900',
    services: [
      { key: 'takipci', name: 'Global Takipçi', unit: 'Takipçi', base: 119, audience: 'global' },
      { key: 'izlenme', name: 'İzlenme', unit: 'İzlenme', base: 33, audience: 'global' },
    ],
  },
  {
    slug: 'discord', name: 'Discord', icon: '💬', gradient: 'from-indigo-600 to-indigo-800',
    services: [{ key: 'uye', name: 'Sunucu Üyesi', unit: 'Üye', base: 89, inputLabel: 'Davet linki', inputPrefix: '', audience: 'global' }],
  },
  {
    slug: 'threads', name: 'Threads', icon: '🧵', gradient: 'from-gray-800 to-gray-950',
    services: [
      { key: 'takipci', name: 'Global Takipçi', unit: 'Takipçi', base: 105, audience: 'global' },
      { key: 'begeni', name: 'Beğeni', unit: 'Beğeni', base: 38, audience: 'global' },
    ],
  },
  {
    slug: 'kick', name: 'Kick', icon: '🟢', gradient: 'from-green-400 to-green-600',
    services: [
      { key: 'takipci', name: 'Global Takipçi', unit: 'Takipçi', base: 112, audience: 'global' },
      { key: 'izlenme', name: 'İzlenme', unit: 'İzlenme', base: 38, audience: 'global' },
    ],
  },
  {
    slug: 'soundcloud', name: 'SoundCloud', icon: '☁️', gradient: 'from-orange-500 to-orange-700',
    services: [
      { key: 'takipci', name: 'Global Takipçi', unit: 'Takipçi', base: 99, audience: 'global' },
      { key: 'dinlenme', name: 'Dinlenme', unit: 'Dinlenme', base: 27, inputLabel: 'Parça linki', inputPrefix: '', audience: 'global' },
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
