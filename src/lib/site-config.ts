/** Site-wide contact, payment and legal config — env overrides supported */
export const SITE = {
  name: 'ProMedia',
  domain: 'promedia-kappa.vercel.app',
  email: process.env.SITE_EMAIL ?? 'destek@promedia.com.tr',
  whatsapp: process.env.SITE_WHATSAPP ?? '905551234567',
  whatsappMessage: encodeURIComponent('Merhaba, ProMedia hakkında bilgi almak istiyorum.'),
  get whatsappUrl() {
    return `https://wa.me/${this.whatsapp}?text=${this.whatsappMessage}`
  },
  phone: process.env.SITE_PHONE ?? '+90 555 123 45 67',
  address: 'İstanbul, Türkiye',
  workingHours: '7/24 online destek',
} as const

export const BANK_ACCOUNTS = [
  {
    bank: 'Ziraat Bankası',
    holder: 'ProMedia Dijital Hizmetler',
    iban: process.env.BANK_IBAN ?? 'TR00 0000 0000 0000 0000 0000 00',
    branch: 'Merkez Şube',
  },
  {
    bank: 'Papara',
    holder: 'ProMedia',
    iban: process.env.PAPARA_NO ?? '1234567890',
    branch: 'Papara No',
  },
] as const

export function paymentReference(userId: string, email: string) {
  const short = userId.slice(-6).toUpperCase()
  return `PM-${short}-${email.split('@')[0].slice(0, 8).toUpperCase()}`
}
