import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal/legal-page'
import { SITE } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'İade Koşulları',
  description: 'ProMedia sipariş iade ve telafi politikası.',
}

export default function IadePage() {
  return (
    <LegalPage title="İade Koşulları" subtitle="Dijital hizmet iade ve telafi politikamız">
      <p>
        SMM hizmetleri dijital ve anında işleme alınan ürünlerdir. Genel iade koşulları aşağıdadır.
      </p>
      <h2 className="text-xl font-bold">Telafi (Refill) Garantisi</h2>
      <p>
        Telafi destekli servislerde belirtilen süre içinde düşüş yaşanırsa ücretsiz telafi talep edebilirsiniz.
        Panel → Telafi veya <a href="/telafi-talebi" className="text-[#7844E4] font-semibold">telafi formu</a> üzerinden başvurun.
      </p>
      <h2 className="text-xl font-bold">İade Edilebilir Durumlar</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Sipariş hiç başlamadıysa ve 48 saat geçtiyse</li>
        <li>Sistem hatası nedeniyle yanlış miktar teslim edildiyse</li>
        <li>Admin tarafından iptal onaylanan siparişler</li>
      </ul>
      <h2 className="text-xl font-bold">İade Edilemeyen Durumlar</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Tamamlanan veya kısmen teslim edilen siparişler</li>
        <li>Hatalı veya gizli profil linki verilmesi</li>
        <li>Platform kurallarına aykırı kullanım</li>
      </ul>
      <p>İade talepleri {SITE.email} veya panel destek üzerinden değerlendirilir.</p>
    </LegalPage>
  )
}
