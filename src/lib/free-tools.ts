export type FreeTool = {
  slug: string
  title: string
  description: string
  platform: string
  icon: string
  color: string
}

export const FREE_TOOLS: FreeTool[] = [
  {
    slug: 'hashtag-olusturucu',
    title: 'Hashtag Oluşturucu',
    description: 'Anahtar kelimeden Instagram ve TikTok için popüler hashtag önerileri üretin.',
    platform: 'Instagram / TikTok',
    icon: '#',
    color: '#7844E4',
  },
  {
    slug: 'karakter-sayaci',
    title: 'Biyografi & Caption Sayacı',
    description: 'Instagram biyografi (150) ve caption (2200) karakter limitlerini anlık kontrol edin.',
    platform: 'Instagram',
    icon: 'Aa',
    color: '#E1306C',
  },
  {
    slug: 'bio-olusturucu',
    title: 'Instagram Bio Oluşturucu',
    description: 'Profil biyografiniz için hazır şablonlar ve emoji kombinasyonları.',
    platform: 'Instagram',
    icon: '✎',
    color: '#FD5501',
  },
  {
    slug: 'takipci-hesaplayici',
    title: 'Büyüme Hesaplayıcı',
    description: 'Hedef takipçi sayınıza ulaşmak için günlük/haftalık büyüme planı hesaplayın.',
    platform: 'Genel',
    icon: '📈',
    color: '#10B981',
  },
  {
    slug: 'kullanici-adi-kontrol',
    title: 'Kullanıcı Adı Kontrol',
    description: 'Instagram/TikTok kullanıcı adı format kurallarını ve önerileri kontrol edin.',
    platform: 'Instagram / TikTok',
    icon: '@',
    color: '#057EF6',
  },
  {
    slug: 'ucretsiz-takipci',
    title: 'Ücretsiz Deneme Paketi',
    description: 'Kayıt olun, panel bakiyenizle küçük demo sipariş verin ve sistemi test edin.',
    platform: 'ProMedia',
    icon: '🎁',
    color: '#7844E4',
  },
]

export function getFreeTool(slug: string) {
  return FREE_TOOLS.find((t) => t.slug === slug)
}

export function getAllToolSlugs() {
  return FREE_TOOLS.map((t) => t.slug)
}
