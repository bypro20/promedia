import type { PackageTier } from '@/lib/packages'

export const TIER_KEYWORDS: Record<PackageTier, string[]> = {
  ucuz: ['ucuz', 'cheap', 'budget', 'economy', 'low', 'bot'],
  standart: ['standart', 'standard', 'global', 'normal', 'karışık', 'karisik'],
  premium: ['premium', 'high', 'quality', 'garanti'],
  gercek: ['gercek', 'gerçek', 'real', 'vip', 'active', 'organic'],
}

export const SERVICE_KEYWORDS: Record<string, string[]> = {
  takipci: ['takipci', 'takipçi', 'follower', 'followers'],
  'ucuz-takipci': ['takipci', 'takipçi', 'follower', 'followers'],
  'turk-takipci': ['turk', 'turkish', 'türk', 'takipci', 'takipçi', 'follower'],
  begeni: ['begeni', 'beğeni', 'like', 'likes', 'heart'],
  'ucuz-begeni': ['begeni', 'beğeni', 'like', 'likes'],
  'turk-begeni': ['turk', 'turkish', 'türk', 'begeni', 'beğeni', 'like'],
  izlenme: ['izlenme', 'view', 'views', 'watch', 'görüntülenme'],
  'ucuz-izlenme': ['izlenme', 'view', 'views'],
  'reels-izlenme': ['reels', 'izlenme', 'view'],
  'hikaye-izlenme': ['story', 'hikaye', 'izlenme', 'view'],
  yorum: ['yorum', 'comment', 'comments'],
  'turk-yorum': ['turk', 'türk', 'yorum', 'comment'],
  kaydetme: ['save', 'kaydet', 'kaydetme'],
  kaydet: ['save', 'kaydet', 'kaydetme'],
  etkilesim: ['engagement', 'etkilesim', 'etkileşim'],
  abone: ['abone', 'subscriber', 'subscribers'],
  'ucuz-abone': ['abone', 'subscriber'],
  'turk-abone': ['turk', 'türk', 'abone', 'subscriber'],
  retweet: ['retweet', 'repost'],
  paylasim: ['share', 'paylasim', 'paylaşım'],
  uye: ['member', 'üye', 'uye', 'grup'],
  dinlenme: ['play', 'plays', 'stream', 'dinlenme', 'dinleme'],
  'aylik-dinleyici': ['monthly', 'listener', 'listeners', 'dinleyici', 'dinleyic'],
  goruntulenme: ['view', 'goruntulenme', 'görüntülenme'],
  reaksiyon: ['reaction', 'reaksiyon'],
  'canli-izlenme': ['canlı', 'canli', 'live', 'izlenme', 'view'],
  'shorts-izlenme': ['shorts', 'izlenme', 'view'],
  'shorts-begeni': ['shorts', 'beğeni', 'begeni', 'like'],
  '4000-saat': ['4000', 'saat', 'hour', 'watch'],
  'profil-takipci': ['profil', 'takipci', 'takipçi', 'follower'],
  'sayfa-begeni': ['sayfa', 'page', 'beğeni', 'begeni', 'like'],
  'otomatik-begeni': ['otomatik', 'auto', 'beğeni', 'begeni', 'like'],
  'otomatik-izlenme': ['otomatik', 'auto', 'izlenme', 'view'],
}

/** Servis tipi için zorunlu ana kelime — yalnızca "turk" ile eşleşmeyi engeller */
const REQUIRED_KEYWORDS: Record<string, string[]> = {
  takipci: ['follower', 'followers', 'takipci', 'takipçi'],
  'ucuz-takipci': ['follower', 'followers', 'takipci', 'takipçi'],
  'turk-takipci': ['follower', 'followers', 'takipci', 'takipçi'],
  'profil-takipci': ['follower', 'followers', 'takipci', 'takipçi'],
  begeni: ['like', 'likes', 'begeni', 'beğeni', 'heart'],
  'ucuz-begeni': ['like', 'likes', 'begeni', 'beğeni'],
  'turk-begeni': ['like', 'likes', 'begeni', 'beğeni'],
  'sayfa-begeni': ['like', 'likes', 'begeni', 'beğeni', 'page'],
  'shorts-begeni': ['like', 'likes', 'begeni', 'beğeni', 'shorts'],
  'otomatik-begeni': ['like', 'likes', 'begeni', 'beğeni', 'auto'],
  izlenme: ['view', 'views', 'izlenme', 'watch', 'görüntülenme'],
  'ucuz-izlenme': ['view', 'views', 'izlenme', 'watch'],
  'reels-izlenme': ['view', 'views', 'izlenme', 'reels'],
  'hikaye-izlenme': ['view', 'views', 'izlenme', 'story', 'hikaye'],
  'canli-izlenme': ['live', 'canli', 'canlı', 'view', 'izlenme'],
  'shorts-izlenme': ['shorts', 'view', 'views', 'izlenme'],
  'otomatik-izlenme': ['view', 'views', 'izlenme', 'auto'],
  abone: ['subscriber', 'subscribers', 'abone'],
  'ucuz-abone': ['subscriber', 'subscribers', 'abone'],
  'turk-abone': ['subscriber', 'subscribers', 'abone'],
  yorum: ['comment', 'comments', 'yorum'],
  'turk-yorum': ['comment', 'comments', 'yorum'],
  retweet: ['retweet', 'repost'],
  paylasim: ['share', 'paylasim', 'paylaşım'],
  uye: ['member', 'members', 'üye', 'uye'],
  dinlenme: ['play', 'plays', 'stream', 'dinlenme', 'dinleme'],
  'aylik-dinleyici': ['listener', 'listeners', 'dinleyici', 'monthly'],
  goruntulenme: ['view', 'views', 'goruntulenme', 'görüntülenme'],
  reaksiyon: ['reaction', 'reactions', 'reaksiyon'],
  kaydetme: ['save', 'kaydet'],
  kaydet: ['save', 'kaydet'],
  etkilesim: ['engagement', 'etkilesim', 'etkileşim', 'impression', 'reach'],
  '4000-saat': ['4000', 'watch time', 'watchtime', 'saat', 'hour'],
}

const TURK_MARKERS = ['turkish', 'türk', 'turkey', 'türkiye', '%100 türk', '100% türk']
const FALSE_TURK_HINTS = ['turkmenistan', 'turkmen']

function hasTurkMarker(text: string): boolean {
  const lower = text.toLowerCase()
  if (FALSE_TURK_HINTS.some((h) => lower.includes(h))) return false
  if (TURK_MARKERS.some((kw) => lower.includes(kw))) return true
  return /\bturk\b/.test(lower)
}

/** Yanlış eşlemeyi önlemek için servis tipine göre hariç tutulan kelimeler */
export const SERVICE_EXCLUDE: Record<string, string[]> = {
  takipci: ['izlenme', 'view', 'beğeni', 'begeni', 'like', 'yorum', 'comment', 'reels', 'story', 'hikaye', 'save', 'kaydet', 'retweet', 'share', 'paylasim', 'dinlenme', 'play', 'abone', 'subscriber', 'member', 'üye'],
  'ucuz-takipci': ['izlenme', 'view', 'beğeni', 'begeni', 'like', 'yorum', 'comment', 'reels', 'story'],
  'turk-takipci': ['izlenme', 'view', 'beğeni', 'begeni', 'like', 'yorum', 'comment', 'comments'],
  begeni: ['izlenme', 'view', 'takip', 'follower', 'takipçi', 'takipci', 'yorum', 'comment', 'abone', 'subscriber', 'retweet', 'share'],
  'ucuz-begeni': ['izlenme', 'view', 'takip', 'follower', 'yorum'],
  'turk-begeni': ['izlenme', 'view', 'takip', 'follower', 'yorum'],
  izlenme: ['takip', 'follower', 'takipçi', 'takipci', 'beğeni', 'begeni', 'like', 'abone', 'subscriber', 'yorum', 'comment', 'retweet'],
  'ucuz-izlenme': ['takip', 'follower', 'beğeni', 'begeni', 'like'],
  'reels-izlenme': ['takip', 'follower', 'beğeni', 'begeni', 'like', 'yorum'],
  'hikaye-izlenme': ['takip', 'follower', 'beğeni', 'begeni', 'like'],
  abone: ['izlenme', 'view', 'beğeni', 'begeni', 'like', 'dislike', 'yorum', 'comment', 'retweet', 'share'],
  'ucuz-abone': ['izlenme', 'view', 'beğeni', 'like'],
  'turk-abone': ['izlenme', 'view', 'beğeni', 'like'],
  yorum: ['izlenme', 'view', 'takip', 'follower', 'beğeni', 'begeni', 'like'],
  retweet: ['izlenme', 'view', 'takip', 'follower', 'beğeni', 'like', 'yorum'],
  uye: ['view', 'izlenme', 'beğeni', 'like', 'takip', 'follower'],
}

export const PLATFORM_KEYWORDS: Record<string, string[]> = {
  instagram: ['instagram', 'insta'],
  tiktok: ['tiktok', 'tik tok'],
  youtube: ['youtube', ' yt'],
  twitter: ['twitter', 'x.com', ' tweet'],
  facebook: ['facebook', ' fb'],
  telegram: ['telegram', ' tg'],
  spotify: ['spotify'],
  linkedin: ['linkedin'],
  pinterest: ['pinterest'],
  twitch: ['twitch'],
  discord: ['discord'],
  threads: ['threads'],
  kick: ['kick'],
  soundcloud: ['soundcloud'],
}

/** Yanlış platform eşlemesini önle (Likee, Kuaishou vb.) */
const WRONG_PLATFORM_HINTS: Record<string, string[]> = {
  instagram: ['tiktok', 'twitter', 'youtube', 'likee', 'facebook', 'telegram', 'spotify', 'soundcloud', 'kuaishou', 'kick', 'twitch', 'discord', 'linkedin', 'pinterest', 'threads'],
  tiktok: ['instagram', 'twitter', 'youtube', 'likee', 'facebook', 'spotify', 'soundcloud', 'kuaishou', 'kick', 'twitch'],
  youtube: ['instagram', 'tiktok', 'twitter', 'likee', 'spotify', 'soundcloud', 'kuaishou', 'kick', 'facebook'],
  twitter: ['instagram', 'tiktok', 'youtube', 'likee', 'facebook', 'spotify', 'soundcloud', 'kuaishou'],
  facebook: ['instagram', 'tiktok', 'youtube', 'twitter', 'spotify', 'soundcloud', 'kuaishou', 'telegram'],
  telegram: ['instagram', 'tiktok', 'youtube', 'twitter', 'facebook', 'spotify', 'soundcloud'],
  spotify: ['instagram', 'tiktok', 'youtube', 'twitter', 'facebook', 'soundcloud', 'kuaishou', 'kick'],
  soundcloud: ['instagram', 'tiktok', 'youtube', 'twitter', 'facebook', 'spotify', 'kuaishou'],
  linkedin: ['instagram', 'tiktok', 'youtube', 'twitter', 'facebook', 'spotify'],
  pinterest: ['instagram', 'tiktok', 'youtube', 'twitter', 'facebook', 'spotify'],
  twitch: ['instagram', 'tiktok', 'youtube', 'twitter', 'facebook', 'spotify', 'kick'],
  discord: ['instagram', 'tiktok', 'youtube', 'twitter', 'facebook', 'spotify', 'telegram'],
  threads: ['instagram', 'tiktok', 'youtube', 'twitter', 'facebook', 'spotify'],
  kick: ['instagram', 'tiktok', 'youtube', 'twitter', 'facebook', 'spotify', 'twitch'],
}

const KNOWN_PLATFORMS = Object.keys(PLATFORM_KEYWORDS).sort((a, b) => b.length - a.length)

export function parseServiceSlug(slug: string) {
  const suffix = '-satin-al'
  if (!slug.endsWith(suffix)) return { platform: '', serviceKey: slug }

  const body = slug.slice(0, -suffix.length)
  for (const platform of KNOWN_PLATFORMS) {
    const prefix = `${platform}-`
    if (body.startsWith(prefix)) {
      return { platform, serviceKey: body.slice(prefix.length) }
    }
  }
  if (KNOWN_PLATFORMS.includes(body)) return { platform: body, serviceKey: 'takipci' }
  const dash = body.indexOf('-')
  if (dash === -1) return { platform: body, serviceKey: 'takipci' }
  return { platform: body.slice(0, dash), serviceKey: body.slice(dash + 1) }
}

export function parseSmmRate(rate?: string): number {
  if (!rate) return Number.POSITIVE_INFINITY
  const n = parseFloat(rate.replace(',', '.'))
  return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY
}

const MIN_MATCH_SCORE = 18

export function scoreSmmServiceName(
  name: string,
  platform: string,
  serviceKey: string,
  tierId: PackageTier
): number {
  const lower = name.toLowerCase()

  for (const wrong of WRONG_PLATFORM_HINTS[platform] ?? []) {
    if (lower.includes(wrong)) return -1
  }

  for (const ex of SERVICE_EXCLUDE[serviceKey] ?? []) {
    if (lower.includes(ex)) return -1
  }

  if (!platform || !PLATFORM_KEYWORDS[platform]) return -1

  let score = 0
  let platformHit = false
  for (const kw of PLATFORM_KEYWORDS[platform]) {
    const k = kw.trim()
    if (!k) continue
    if (lower.includes(k)) {
      score += 10
      platformHit = true
    }
  }
  if (!platformHit) return -1

  const required = REQUIRED_KEYWORDS[serviceKey]
  if (required && !required.some((kw) => lower.includes(kw))) return -1
  if (serviceKey.includes('turk') && !hasTurkMarker(lower)) return -1

  let serviceHit = false
  for (const kw of SERVICE_KEYWORDS[serviceKey] ?? [serviceKey.replace(/-/g, ' ')]) {
    if (lower.includes(kw)) {
      score += 8
      serviceHit = true
    }
  }
  if (!serviceHit) return -1

  for (const kw of TIER_KEYWORDS[tierId]) {
    if (lower.includes(kw)) score += 5
  }

  if (tierId === 'ucuz' && (lower.includes('turk') || lower.includes('türk'))) score -= 6
  if (serviceKey.includes('turk') && (lower.includes('turk') || lower.includes('türk'))) score += 6
  if (tierId === 'gercek' && lower.includes('bot')) score -= 8
  if (tierId === 'ucuz' && lower.includes('bot')) score += 4

  return score >= MIN_MATCH_SCORE ? score : -1
}
