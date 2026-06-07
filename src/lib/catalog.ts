import { buildThreeTiers, buildFaq, type ServiceDefinition, type PackageTier } from './packages'

type Svc = { key: string; name: string; unit: string; base: number; defaultTier?: PackageTier; inputLabel?: string; inputPrefix?: string }
type Platform = { slug: string; name: string; icon: string; gradient: string; services: Svc[] }

const PLATFORMS: Platform[] = [
  {
    slug: 'instagram', name: 'Instagram', icon: '📸', gradient: 'from-[#f58529] via-[#dd2a7b] to-[#8134af]',
    services: [
      { key: 'takipci', name: 'Takipçi', unit: 'Takipçi', base: 89 },
      { key: 'turk-takipci', name: 'Türk Takipçi', unit: 'Türk Takipçi', base: 129 },
      { key: 'begeni', name: 'Beğeni', unit: 'Beğeni', base: 29 },
      { key: 'turk-begeni', name: 'Organik Türk Beğeni', unit: 'Türk Beğeni', base: 45 },
      { key: 'izlenme', name: 'Video İzlenme', unit: 'İzlenme', base: 15 },
      { key: 'reels-izlenme', name: 'Reels İzlenme', unit: 'İzlenme', base: 18 },
      { key: 'hikaye-izlenme', name: 'Hikaye İzlenme', unit: 'İzlenme', base: 12 },
      { key: 'yorum', name: 'Yorum', unit: 'Yorum', base: 49 },
      { key: 'turk-yorum', name: 'Gerçek Türk Yorum', unit: 'Türk Yorum', base: 69 },
      { key: 'kaydetme', name: 'Kaydetme', unit: 'Kaydetme', base: 35 },
      { key: 'etkilesim', name: 'Etkileşim', unit: 'Etkileşim', base: 55 },
      { key: 'otomatik-begeni', name: 'Otomatik Beğeni', unit: 'Beğeni', base: 79 },
    ],
  },
  {
    slug: 'tiktok', name: 'TikTok', icon: '🎵', gradient: 'from-gray-900 to-pink-500',
    services: [
      { key: 'takipci', name: 'Takipçi', unit: 'Takipçi', base: 79 },
      { key: 'turk-takipci', name: 'Türk Takipçi', unit: 'Türk Takipçi', base: 119 },
      { key: 'begeni', name: 'Beğeni', unit: 'Beğeni', base: 22 },
      { key: 'turk-begeni', name: 'Türk Beğeni', unit: 'Türk Beğeni', base: 35 },
      { key: 'izlenme', name: 'İzlenme', unit: 'İzlenme', base: 12 },
      { key: 'paylasim', name: 'Paylaşım', unit: 'Paylaşım', base: 29 },
      { key: 'kaydet', name: 'Kaydet', unit: 'Kaydetme', base: 25 },
      { key: 'otomatik-begeni', name: 'Otomatik Beğeni', unit: 'Beğeni', base: 65 },
      { key: 'otomatik-izlenme', name: 'Otomatik İzlenme', unit: 'İzlenme', base: 55 },
    ],
  },
  {
    slug: 'youtube', name: 'YouTube', icon: '▶️', gradient: 'from-red-700 to-red-500',
    services: [
      { key: 'abone', name: 'Abone', unit: 'Abone', base: 149 },
      { key: 'turk-abone', name: 'Türk Abone', unit: 'Türk Abone', base: 199 },
      { key: 'begeni', name: 'Beğeni', unit: 'Beğeni', base: 35 },
      { key: 'izlenme', name: 'İzlenme', unit: 'İzlenme', base: 18 },
      { key: '4000-saat', name: '4000 Saat İzlenme', unit: 'Saat', base: 899, inputLabel: 'Kanal linki', inputPrefix: '' },
      { key: 'shorts-begeni', name: 'Shorts Beğeni', unit: 'Beğeni', base: 28 },
      { key: 'shorts-izlenme', name: 'Shorts İzlenme', unit: 'İzlenme', base: 15 },
      { key: 'canli-izlenme', name: 'Canlı Yayın İzlenme', unit: 'İzlenme', base: 45 },
      { key: 'yorum', name: 'Yorum', unit: 'Yorum', base: 55 },
    ],
  },
  {
    slug: 'twitter', name: 'Twitter', icon: '🐦', gradient: 'from-sky-400 to-blue-600',
    services: [
      { key: 'takipci', name: 'Takipçi', unit: 'Takipçi', base: 69 },
      { key: 'turk-takipci', name: 'Organik Türk Takipçi', unit: 'Türk Takipçi', base: 109 },
      { key: 'begeni', name: 'Beğeni', unit: 'Beğeni', base: 25 },
      { key: 'turk-begeni', name: 'Türk Beğeni', unit: 'Türk Beğeni', base: 39 },
      { key: 'retweet', name: 'ReTweet', unit: 'ReTweet', base: 35 },
      { key: 'izlenme', name: 'Tweet Görüntülenme', unit: 'Görüntülenme', base: 15 },
      { key: 'yorum', name: 'Yorum', unit: 'Yorum', base: 45 },
    ],
  },
  {
    slug: 'facebook', name: 'Facebook', icon: '👍', gradient: 'from-blue-600 to-blue-800',
    services: [
      { key: 'takipci', name: 'Takipçi', unit: 'Takipçi', base: 85 },
      { key: 'profil-takipci', name: 'Profil Takipçi', unit: 'Takipçi', base: 95 },
      { key: 'begeni', name: 'Beğeni', unit: 'Beğeni', base: 35 },
      { key: 'sayfa-begeni', name: 'Sayfa Beğenisi', unit: 'Beğeni', base: 45 },
      { key: 'turk-begeni', name: 'Türk Beğeni', unit: 'Türk Beğeni', base: 55 },
      { key: 'izlenme', name: 'Video İzlenme', unit: 'İzlenme', base: 18 },
      { key: 'yorum', name: 'Yorum', unit: 'Yorum', base: 49 },
    ],
  },
  {
    slug: 'telegram', name: 'Telegram', icon: '✈️', gradient: 'from-sky-400 to-blue-500',
    services: [
      { key: 'uye', name: 'Grup / Kanal Üyesi', unit: 'Üye', base: 59, inputLabel: 'Kanal linki', inputPrefix: '' },
      { key: 'goruntulenme', name: 'Görüntülenme', unit: 'Görüntülenme', base: 15, inputLabel: 'Gönderi linki', inputPrefix: '' },
      { key: 'reaksiyon', name: 'Reaksiyon', unit: 'Reaksiyon', base: 29, inputLabel: 'Gönderi linki', inputPrefix: '' },
    ],
  },
  {
    slug: 'spotify', name: 'Spotify', icon: '🎧', gradient: 'from-green-500 to-green-700',
    services: [
      { key: 'takipci', name: 'Takipçi', unit: 'Takipçi', base: 79, inputLabel: 'Sanatçı linki', inputPrefix: '' },
      { key: 'dinlenme', name: 'Dinlenme', unit: 'Dinlenme', base: 22, inputLabel: 'Şarkı linki', inputPrefix: '' },
      { key: 'aylik-dinleyici', name: 'Aylık Dinleyici', unit: 'Dinleyici', base: 149, inputLabel: 'Sanatçı linki', inputPrefix: '' },
      { key: 'kaydetme', name: 'Kaydetme', unit: 'Kaydetme', base: 35, inputLabel: 'Şarkı linki', inputPrefix: '' },
    ],
  },
  {
    slug: 'linkedin', name: 'LinkedIn', icon: '💼', gradient: 'from-blue-700 to-blue-900',
    services: [
      { key: 'takipci', name: 'Takipçi', unit: 'Takipçi', base: 99 },
      { key: 'begeni', name: 'Beğeni', unit: 'Beğeni', base: 45 },
    ],
  },
  {
    slug: 'pinterest', name: 'Pinterest', icon: '📌', gradient: 'from-red-600 to-red-800',
    services: [
      { key: 'takipci', name: 'Takipçi', unit: 'Takipçi', base: 75 },
      { key: 'begeni', name: 'Beğeni', unit: 'Beğeni', base: 35 },
    ],
  },
  {
    slug: 'twitch', name: 'Twitch', icon: '🎮', gradient: 'from-purple-700 to-purple-900',
    services: [
      { key: 'takipci', name: 'Takipçi', unit: 'Takipçi', base: 89 },
      { key: 'izlenme', name: 'İzlenme', unit: 'İzlenme', base: 25 },
    ],
  },
  {
    slug: 'discord', name: 'Discord', icon: '💬', gradient: 'from-indigo-600 to-indigo-800',
    services: [{ key: 'uye', name: 'Sunucu Üyesi', unit: 'Üye', base: 69, inputLabel: 'Davet linki', inputPrefix: '' }],
  },
  {
    slug: 'threads', name: 'Threads', icon: '🧵', gradient: 'from-gray-800 to-gray-950',
    services: [
      { key: 'takipci', name: 'Takipçi', unit: 'Takipçi', base: 79 },
      { key: 'begeni', name: 'Beğeni', unit: 'Beğeni', base: 29 },
    ],
  },
  {
    slug: 'kick', name: 'Kick', icon: '🟢', gradient: 'from-green-400 to-green-600',
    services: [
      { key: 'takipci', name: 'Takipçi', unit: 'Takipçi', base: 85 },
      { key: 'izlenme', name: 'İzlenme', unit: 'İzlenme', base: 28 },
    ],
  },
  {
    slug: 'soundcloud', name: 'SoundCloud', icon: '☁️', gradient: 'from-orange-500 to-orange-700',
    services: [
      { key: 'takipci', name: 'Takipçi', unit: 'Takipçi', base: 75 },
      { key: 'dinlenme', name: 'Dinlenme', unit: 'Dinlenme', base: 20, inputLabel: 'Parça linki', inputPrefix: '' },
    ],
  },
]

function makeService(p: Platform, s: Svc): ServiceDefinition {
  const slug = `${p.slug}-${s.key}-satin-al`
  const prefix = slug.replace(/-/g, '').slice(0, 5)
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
    defaultTier: s.defaultTier ?? 'standart',
    tiers: buildThreeTiers(prefix, s.base, s.unit),
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
  return PLATFORMS.map((p) => ({
    platform: p.name,
    icon: p.icon,
    color: p.gradient,
    items: p.services.map((s) => ({
      name: `${p.name} ${s.name}`,
      href: `/${p.slug}-${s.key}-satin-al`,
    })),
  }))
}

export const PLATFORM_SERVICES = getPlatformGroups()
