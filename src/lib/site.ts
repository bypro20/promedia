export const SITE = {
  name: 'ProMedia',
  tagline: 'Sosyal medyada profesyonel büyüme',
  description:
    'Instagram, TikTok, YouTube ve daha fazlası için takipçi, beğeni ve izlenme hizmetleri. Güvenli ödeme, hızlı teslimat, telafi garantisi.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prmdia.com',
  email: process.env.SITE_EMAIL ?? 'destek@prmdia.com',
  whatsapp: '905051236824',
  supportHours: '7/24',
} as const

export const TRUST_ITEMS = [
  { label: 'Hızlı teslimat', sub: '0–15 dk başlangıç' },
  { label: 'Güvenli ödeme', sub: '3D Secure' },
  { label: 'Telafi garantisi', sub: '30–90 gün' },
  { label: '7/24 destek', sub: 'Canlı yardım' },
] as const
