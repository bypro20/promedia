/** Site-wide contact, payment and legal config — env overrides supported */

function resolveSiteDomain(): string {
  const fromEnv = process.env.SITE_DOMAIN?.trim()
  if (fromEnv) return fromEnv.replace(/^https?:\/\//, '').replace(/\/$/, '')

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (siteUrl) {
    try {
      return new URL(siteUrl).hostname
    } catch {
      /* ignore */
    }
  }

  if (process.env.VERCEL_URL) return process.env.VERCEL_URL

  return 'prmdia.com'
}

export function getSiteDomain() {
  return resolveSiteDomain()
}

export const SITE = {
  name: 'ProMedia',
  domain: resolveSiteDomain(),
  email: process.env.SITE_EMAIL ?? 'destek@prmdia.com',
  whatsapp: process.env.SITE_WHATSAPP ?? '905051236824',
  whatsappMessage: encodeURIComponent('Merhaba, ProMedia hakkında bilgi almak istiyorum.'),
  get whatsappUrl() {
    return `https://wa.me/${this.whatsapp}?text=${this.whatsappMessage}`
  },
  phone: process.env.SITE_PHONE ?? '0505 123 68 24',
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
] as const

export function paymentReference(userId: string, email: string) {
  const short = userId.slice(-6).toUpperCase()
  return `PM-${short}-${email.split('@')[0].slice(0, 8).toUpperCase()}`
}
