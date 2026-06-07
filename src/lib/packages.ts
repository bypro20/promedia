export type PackageTier = 'standart' | 'premium' | 'gercek'

export type FollowerPackage = {
  id: string
  amount: number
  price: number
  popular?: boolean
  bonus?: boolean
  savings?: number
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
  defaultTier: PackageTier
  tiers: TierInfo[]
  faq: FaqItem[]
}

export const PACKAGE_AMOUNTS = [
  100, 250, 500, 750, 1000, 2000, 2500, 4000, 5000, 7500,
  10000, 15000, 20000, 30000, 40000, 50000, 100000,
] as const

const SAVINGS: Record<number, number> = {
  100: 0, 250: 8, 500: 18, 750: 24, 1000: 22, 2000: 29, 2500: 26,
  4000: 40, 5000: 42, 7500: 44, 10000: 46, 15000: 48, 20000: 51,
  30000: 53, 40000: 55, 50000: 61, 100000: 68,
}

function calcPrice(amount: number, basePer1k: number): number {
  const raw = (amount / 1000) * basePer1k
  const min = amount <= 100 ? 24.9 : amount <= 250 ? 39.9 : 49.9
  return Math.round(Math.max(min, raw * (amount < 1000 ? 1.15 : 1)) * 100) / 100 - 0.03
}

export function buildPackages(prefix: string, basePer1k: number): FollowerPackage[] {
  return PACKAGE_AMOUNTS.map((amount) => {
    const savings = SAVINGS[amount]
    return {
      id: `${prefix}-${amount}`,
      amount,
      price: calcPrice(amount, basePer1k),
      bonus: amount === 100,
      popular: amount === 1000,
      savings: savings > 0 ? savings : undefined,
    }
  })
}

/** SosyalDigital ile aynı 3 kademe: Standart · Premium · Gerçek VIP */
export function buildThreeTiers(prefix: string, basePer1k: number, unit: string): TierInfo[] {
  return [
    {
      id: 'standart',
      name: `Standart ${unit}`,
      shortName: 'Standart',
      description: 'Yabancı kullanıcılar — hızlı ve uygun fiyat',
      color: 'from-blue-500 to-indigo-600',
      features: ['Yabancı kullanıcılar', '30 gün garantili', '0–15 dk başlangıç', 'Şifre istemiyoruz'],
      packages: buildPackages(`${prefix}s`, basePer1k),
    },
    {
      id: 'premium',
      name: `Premium ${unit}`,
      shortName: 'Premium',
      description: '%100 gerçek yabancı premium profiller',
      color: 'from-purple-600 to-violet-600',
      features: ['%100 gerçek yabancı kullanıcılar', '30 gün garantili', '0–15 dk başlangıç', 'Şifre istemiyoruz'],
      packages: buildPackages(`${prefix}p`, basePer1k * 1.4),
    },
    {
      id: 'gercek',
      name: `Gerçek ${unit}`,
      shortName: 'Gerçek',
      badge: 'VIP',
      description: 'Minimum düşüş — 90 gün telafili',
      color: 'from-orange-500 to-red-500',
      features: ['%100 gerçek yabancı kullanıcılar', '90 gün telafili', 'Hızlı başlangıç', 'Minimum düşüş', 'Şifre istemiyoruz'],
      packages: buildPackages(`${prefix}g`, basePer1k * 2.1),
    },
  ]
}

export function getDefaultPackageId(tiers: TierInfo[], tierId: PackageTier): string {
  const tier = tiers.find((t) => t.id === tierId) ?? tiers[0]
  return (tier.packages.find((p) => p.popular) ?? tier.packages[0]).id
}

export function buildFaq(platform: string, unit: string): FaqItem[] {
  return [
    { q: `${platform} ${unit} satın almak neden önemlidir?`, a: `${unit} sayısı hesabınızın popülerliğini artırır ve daha fazla görünürlük sağlar. Yüksek ${unit} daha fazla etkileşim getirir.` },
    { q: 'En iyi satın alma sitesi hangisi?', a: 'ProMedia kaliteli, uygun fiyatlı ve hızlı teslimat sunar. 7/24 destek ve telafi garantisi ile hizmet verir.' },
    { q: `${unit} satın almak erişim oranını artırır mı?`, a: 'Evet. Daha yüksek sayılar hesabınızın daha popüler görünmesini sağlar.' },
    { q: 'Güvenli mi?', a: 'Güvenilir siteden alındığında hesabınız güvendedir. Şifre asla istenmez, 3D Secure ödeme kullanılır.' },
  ]
}

export const TIER_COMPARE = [
  { label: 'Garanti', standart: '30 gün', premium: '30 gün', gercek: '90 gün' },
  { label: 'Profil tipi', standart: 'Yabancı', premium: 'Premium yabancı', gercek: 'Gerçek aktif' },
  { label: 'Düşüş', standart: 'Normal', premium: 'Düşük', gercek: 'Minimum' },
  { label: 'Başlangıç', standart: '0–15 dk', premium: '0–15 dk', gercek: 'Hızlı' },
]
