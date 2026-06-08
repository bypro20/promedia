import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal/legal-page'
import { SITE } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Hakkımızda',
  description: 'ProMedia — güvenilir SMM panel, sosyal medya büyüme hizmetleri.',
}

export default function HakkimizdaPage() {
  return (
    <LegalPage title="Hakkımızda" subtitle="Sosyal medyada güvenilir büyüme partneriniz">
      <p>
        {SITE.name}, Instagram, TikTok, YouTube ve diğer platformlar için takipçi, beğeni, izlenme ve etkileşim
        hizmetleri sunan Türkiye merkezli bir SMM panelidir. Amacımız hızlı teslimat, şeffaf fiyatlandırma ve
        hesap güvenliğine öncelik vermektir.
      </p>
      <h2 className="text-xl font-bold">Neden ProMedia?</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>7/24 müşteri desteği ve sipariş takibi</li>
        <li>Telafi (refill) garantisi desteklenen servislerde</li>
        <li>SSL korumalı ödeme ve güvenli panel altyapısı</li>
        <li>Bayi API ile kendi sitenize entegrasyon imkânı</li>
        <li>Çoklu SMM sağlayıcı — otomatik en uygun fiyat seçimi</li>
      </ul>
      <h2 className="text-xl font-bold">Misyonumuz</h2>
      <p>
        İçerik üreticileri, markalar ve dijital ajansların sosyal medya hedeflerine ulaşmasını kolaylaştırmak.
        Şifre istemeyen, link tabanlı güvenli sipariş modeli ile sektörde güvenilir bir alternatif sunmak.
      </p>
    </LegalPage>
  )
}
