import { SITE } from './site-config'

/** iyzico / 6502 K. uyumlu satıcı bilgileri — env ile güncellenir */
export const LEGAL = {
  companyName: process.env.SITE_COMPANY_NAME ?? 'ProMedia Dijital Hizmetler',
  tradeName: SITE.name,
  domain: SITE.domain,
  email: SITE.email,
  phone: SITE.phone,
  address: process.env.SITE_ADDRESS ?? 'Atatürk Mah. Ertuğrul Gazi Sok. No:12/3 Ataşehir / İstanbul',
  city: 'İstanbul',
  mersisNo: process.env.SITE_MERSIS ?? '0617048932000012',
  taxOffice: process.env.SITE_TAX_OFFICE ?? 'Kozyatağı VD',
  taxNo: process.env.SITE_TAX_NO ?? '6230147892',
  kepmail: process.env.SITE_KEP ?? '',
  paymentProvider: 'iyzico Ödeme Hizmetleri A.Ş.',
  paymentMethods: 'Visa, Mastercard, Troy (iyzico altyapısı)',
  deliveryType: 'Dijital hizmet — elektronik ortamda anında ifa',
  maxDeliveryDays: 3,
  refundDays: 14,
  disputeAuthority: 'Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri',
} as const

export const LEGAL_LINKS = [
  { label: 'Hakkımızda', href: '/hakkimizda' },
  { label: 'Teslimat ve İade Şartları', href: '/teslimat-iade-sartlari' },
  { label: 'Gizlilik Sözleşmesi', href: '/gizlilik-sozlesmesi' },
  { label: 'Mesafeli Satış Sözleşmesi', href: '/mesafeli-satis-sozlesmesi' },
  { label: 'Ön Bilgilendirme Formu', href: '/on-bilgilendirme-formu' },
  { label: 'SSL Sertifikası', href: '/ssl-sertifikasi' },
  { label: 'KVKK Aydınlatma', href: '/kvkk' },
  { label: 'İletişim', href: '/iletisim' },
] as const
