export type PackageTier = 'standart' | 'premium' | 'gercek'

export type FollowerPackage = {
  id: string
  amount: number
  price: number
  popular?: boolean
  bonus?: boolean
}

export type TierInfo = {
  id: PackageTier
  name: string
  badge?: string
  features: string[]
  packages: FollowerPackage[]
}

export const INSTAGRAM_FOLLOWER_TIERS: TierInfo[] = [
  {
    id: 'standart',
    name: 'Standart Takipçi',
    features: [
      'Yabancı kullanıcılar',
      '30 gün garanti',
      '0–15 dk başlangıç',
      'Şifre istemiyoruz',
    ],
    packages: [
      { id: 's-100', amount: 100, price: 29.9, bonus: true },
      { id: 's-250', amount: 250, price: 49.9 },
      { id: 's-500', amount: 500, price: 79.9 },
      { id: 's-750', amount: 750, price: 109.9 },
      { id: 's-1k', amount: 1000, price: 139.9, popular: true },
      { id: 's-2k', amount: 2000, price: 249.9 },
      { id: 's-5k', amount: 5000, price: 549.9 },
      { id: 's-10k', amount: 10000, price: 999.9 },
    ],
  },
  {
    id: 'premium',
    name: 'Premium Takipçi',
    features: [
      'Kaliteli yabancı profiller',
      '30 gün garanti',
      '0–15 dk başlangıç',
      'Şifre istemiyoruz',
    ],
    packages: [
      { id: 'p-100', amount: 100, price: 39.9, bonus: true },
      { id: 'p-250', amount: 250, price: 69.9 },
      { id: 'p-500', amount: 500, price: 109.9 },
      { id: 'p-1k', amount: 1000, price: 189.9, popular: true },
      { id: 'p-2k', amount: 2000, price: 329.9 },
      { id: 'p-5k', amount: 5000, price: 749.9 },
      { id: 'p-10k', amount: 10000, price: 1399.9 },
    ],
  },
  {
    id: 'gercek',
    name: 'Gerçek Takipçi',
    badge: 'Önerilen',
    features: [
      'Aktif yabancı hesaplar',
      '90 gün telafi garantisi',
      'Hızlı başlangıç',
      'Şifre istemiyoruz',
      'Minimum düşüş',
    ],
    packages: [
      { id: 'g-100', amount: 100, price: 55.9 },
      { id: 'g-250', amount: 250, price: 99.9 },
      { id: 'g-500', amount: 500, price: 169.9 },
      { id: 'g-1k', amount: 1000, price: 299.9, popular: true },
      { id: 'g-2k', amount: 2000, price: 549.9 },
      { id: 'g-5k', amount: 5000, price: 1199.9 },
      { id: 'g-10k', amount: 10000, price: 2199.9 },
    ],
  },
]

export const FAQ_ITEMS = [
  {
    q: 'Instagram takipçi satın almak güvenli mi?',
    a: 'Evet. Sipariş için yalnızca kullanıcı adınız yeterlidir; şifrenizi asla istemiyoruz. Ödemeler 3D Secure ile korunur.',
  },
  {
    q: 'Teslimat ne kadar sürer?',
    a: 'Çoğu sipariş 0–15 dakika içinde başlar. Büyük paketlerde teslimat kademeli olarak tamamlanır.',
  },
  {
    q: 'Takipçi düşerse ne olur?',
    a: 'Garantili paketlerde telafi talebi oluşturabilirsiniz. Gerçek paketlerde 90 gün telafi hakkı sunuyoruz.',
  },
  {
    q: 'Hangi bilgileri vermem gerekiyor?',
    a: 'Sadece Instagram kullanıcı adınız ve geçerli bir e-posta adresi. Hesabınız gizli olmamalıdır.',
  },
]

export const SERVICES = [
  { name: 'Instagram Takipçi', href: '/instagram-takipci-satin-al' },
  { name: 'Instagram Beğeni', href: '/instagram-takipci-satin-al' },
  { name: 'TikTok Takipçi', href: '#' },
  { name: 'YouTube Abone', href: '#' },
  { name: 'Twitter Takipçi', href: '#' },
]
