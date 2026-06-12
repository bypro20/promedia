import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '@/components/legal/legal-page'

export const metadata: Metadata = {
  title: 'İade Koşulları',
  description: 'ProMedia iade politikası — güncel sayfa teslimat ve iade şartları.',
}

export default function IadePage() {
  return (
    <LegalPage title="İade Koşulları" subtitle="Bu sayfa güncellendi">
      <p>
        İade ve teslimat koşullarımızın tam metni{' '}
        <Link href="/teslimat-iade-sartlari" className="font-bold text-[#7844E4] hover:underline">
          Teslimat ve İade Şartları
        </Link>{' '}
        sayfasına taşınmıştır. iyzico ve 6502 sayılı Kanun uyumlu güncel metin için lütfen o sayfayı inceleyin.
      </p>
      <p>
        <Link href="/teslimat-iade-sartlari" className="inline-block rounded-xl bg-[#7844E4] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#6835d3]">
          Teslimat ve İade Şartları →
        </Link>
      </p>
    </LegalPage>
  )
}
