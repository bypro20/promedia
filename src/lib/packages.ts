export type PackageTier = 'ucuz' | 'standart' | 'premium' | 'gercek'

export type FollowerPackage = {
  id: string
  amount: number
  price: number
  popular?: boolean
  bonus?: boolean
  savings?: number
  cheap?: boolean
}

export type TierInfo = {
  id: PackageTier
  name: string
  shortName: string
  badge?: string
  description: string
  features: string[]
  packages: FollowerPackage[]
  color: string
}

export type FaqItem = { q: string; a: string }

export type ServiceAudience = 'global' | 'turk' | 'ucuz' | 'all'

export type ServiceDefinition = {
  slug: string
  platform: string
  platformSlug: string
  title: string
  unit: string
  inputLabel: string
  inputPrefix: string
  heroGradient: string
  platformIcon: string
  platformColor: string
  platformColorLight: string
  audience: ServiceAudience
  defaultTier: PackageTier
  tiers: TierInfo[]
  faq: FaqItem[]
}

export const PACKAGE_AMOUNTS = [
  100, 250, 500, 750, 1000, 2000, 2500, 4000, 5000, 7500,
  10000, 15000, 20000, 30000, 40000, 50000, 100000,
] as const

/** Ekstra ucuz miktarlar — bütçe dostu paketler */
export const BUDGET_AMOUNTS = [50, 100, 200, 500, 1000, 2500, 5000] as const

const SAVINGS: Record<number, number> = {
  50: 0, 100: 0, 200: 5, 250: 8, 500: 18, 750: 24, 1000: 22, 2000: 29, 2500: 26,
  4000: 40, 5000: 42, 7500: 44, 10000: 46, 15000: 48, 20000: 51,
  30000: 53, 40000: 55, 50000: 61, 100000: 68,
}

function calcPrice(amount: number, basePer1k: number, discount = 1): number {
  const raw = (amount / 1000) * basePer1k * discount
  const min = amount <= 50 ? 9.9 : amount <= 100 ? 14.9 : amount <= 250 ? 24.9 : 39.9
  return Math.round(Math.max(min, raw * (amount < 1000 ? 1.12 : 1)) * 100) / 100 - 0.03
}

export function buildPackages(
  prefix: string,
  basePer1k: number,
  discount = 1,
  amounts: readonly number[] = PACKAGE_AMOUNTS
): FollowerPackage[] {
  return amounts.map((amount) => {
    const savings = SAVINGS[amount] ?? 0
    return {
      id: `${prefix}-${amount}`,
      amount,
      price: calcPrice(amount, basePer1k, discount),
      bonus: amount === 100,
      popular: amount === 1000,
      cheap: amount <= 200,
      savings: savings > 0 ? savings : undefined,
    }
  })
}

export function buildBudgetPackages(prefix: string, basePer1k: number): FollowerPackage[] {
  return buildPackages(`${prefix}b`, basePer1k * 0.52, 1, BUDGET_AMOUNTS).map((p) => ({
    ...p,
    cheap: true,
    bonus: p.amount === 100,
    popular: p.amount === 500,
  }))
}

/** 4 kademe: Ucuz Global · Global Standart · Premium · Gerçek VIP */
export function buildFourTiers(prefix: string, basePer1k: number, unit: string, isTurk = false): TierInfo[] {
  const region = isTurk ? 'Türk' : 'Global'
  return [
    {
      id: 'ucuz',
      name: `Ucuz ${region} ${unit}`,
      shortName: isTurk ? 'Ucuz Türk' : 'Ucuz Global',
      badge: 'EN UCUZ',
      description: 'Bütçe dostu — hızlı teslimat',
      color: 'from-emerald-500 to-green-600',
      features: [
        isTurk ? 'Türk profil karışımı' : 'Global karışık profiller',
        '15 gün garanti',
        'Anında başlangıç',
        'Şifre istemiyoruz',
        'En uygun fiyat',
      ],
      packages: buildBudgetPackages(`${prefix}u`, basePer1k),
    },
    {
      id: 'standart',
      name: `${region} ${unit}`,
      shortName: isTurk ? 'Türk Standart' : 'Global Standart',
      description: isTurk ? 'Türk kullanıcılar — hızlı ve uygun' : 'Global kullanıcılar — hızlı ve uygun fiyat',
      color: 'from-blue-500 to-indigo-600',
      features: [
        isTurk ? '%100 Türk kullanıcılar' : 'Global yabancı kullanıcılar',
        '30 gün garantili',
        '0–15 dk başlangıç',
        'Şifre istemiyoruz',
      ],
      packages: buildPackages(`${prefix}s`, basePer1k),
    },
    {
      id: 'premium',
      name: `Premium ${region} ${unit}`,
      shortName: 'Premium',
      description: '%100 gerçek premium profiller',
      color: 'from-purple-600 to-violet-600',
      features: [
        isTurk ? 'Premium Türk profiller' : '%100 gerçek global profiller',
        '30 gün garantili',
        '0–15 dk başlangıç',
        'Düşük düşüş oranı',
        'Şifre istemiyoruz',
      ],
      packages: buildPackages(`${prefix}p`, basePer1k * 1.35),
    },
    {
      id: 'gercek',
      name: `Gerçek ${region} ${unit}`,
      shortName: 'Gerçek VIP',
      badge: 'VIP',
      description: 'Minimum düşüş — 90 gün telafili',
      color: 'from-orange-500 to-red-500',
      features: [
        isTurk ? 'Gerçek aktif Türk kullanıcılar' : 'Gerçek aktif global kullanıcılar',
        '90 gün telafi garantisi',
        'Öncelikli teslimat',
        'Minimum düşüş',
        'Şifre istemiyoruz',
      ],
      packages: buildPackages(`${prefix}g`, basePer1k * 2.0),
    },
  ]
}

/** Geriye uyumluluk */
export function buildThreeTiers(prefix: string, basePer1k: number, unit: string): TierInfo[] {
  return buildFourTiers(prefix, basePer1k, unit, false).filter((t) => t.id !== 'ucuz')
}

export function getDefaultPackageId(tiers: TierInfo[], tierId: PackageTier): string {
  const tier = tiers.find((t) => t.id === tierId) ?? tiers[0]
  return (tier.packages.find((p) => p.popular) ?? tier.packages[0]).id
}

export function buildFaq(platform: string, unit: string): FaqItem[] {
  return [
    { q: `${platform} ${unit} satın almak neden önemlidir?`, a: `${unit} sayısı hesabınızın popülerliğini artırır ve daha fazla görünürlük sağlar.` },
    { q: 'Global ve Türk paket arasındaki fark nedir?', a: 'Global paketler dünya genelinden, Türk paketler yalnızca Türkiye profillerinden teslim edilir. Ucuz Global en ekonomik seçenektir.' },
    { q: 'Ucuz paketler güvenli mi?', a: 'Evet. Tüm paketlerde şifre istenmez, 3D Secure ödeme kullanılır ve telafi garantisi sunulur.' },
    { q: 'Teslimat ne kadar sürer?', a: 'Çoğu sipariş 0–15 dakikada başlar. Büyük paketler kademeli tamamlanır.' },
  ]
}

export const TIER_COMPARE = [
  { label: 'Garanti', ucuz: '15 gün', standart: '30 gün', premium: '30 gün', gercek: '90 gün' },
  { label: 'Profil tipi', ucuz: 'Global karışık', standart: 'Global', premium: 'Premium global', gercek: 'Gerçek aktif' },
  { label: 'Fiyat', ucuz: 'En ucuz', standart: 'Uygun', premium: 'Orta', gercek: 'Premium' },
  { label: 'Başlangıç', ucuz: 'Anında', standart: '0–15 dk', premium: '0–15 dk', gercek: 'Hızlı' },
]
