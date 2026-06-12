import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal/legal-page'
import { SellerInfoBlock } from '@/components/legal/seller-info-block'
import { LEGAL } from '@/lib/legal-config'
import { SITE } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Teslimat ve İade Şartları',
  description: 'ProMedia dijital hizmet teslimat, cayma ve iade koşulları.',
}

export default function TeslimatIadePage() {
  return (
    <LegalPage title="Teslimat ve İade Şartları" subtitle="Dijital hizmet teslimat ve iade politikası">
      <SellerInfoBlock />

      <h2 className="text-xl font-bold">1. Teslimat Koşulları</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li><strong>Hizmet türü:</strong> {LEGAL.deliveryType}</li>
        <li><strong>Teslimat yöntemi:</strong> Sosyal medya hesabınıza / içeriğinize otomatik etkileşim gönderimi</li>
        <li><strong>Başlangıç süresi:</strong> Ödeme onayından sonra dakikalar — en geç {LEGAL.maxDeliveryDays} iş günü içinde</li>
        <li><strong>Takip:</strong> Sipariş kodunuz ile <a href="/siparis-sorgula" className="font-semibold text-[#7844E4]">sipariş sorgulama</a> veya müşteri paneli</li>
        <li><strong>Fiziksel kargo:</strong> Yapılmaz</li>
      </ul>

      <h2 className="text-xl font-bold">2. Teslimat Gecikmesi</h2>
      <p>
        Sistem yoğunluğu veya üçüncü taraf SMM sağlayıcı kaynaklı gecikmelerde durum sipariş ekranında güncellenir.
        48 saatten uzun gecikmede {SITE.email} veya panel destek üzerinden bilgi alabilirsiniz.
      </p>

      <h2 className="text-xl font-bold">3. Cayma Hakkı</h2>
      <p>
        6502 sayılı Kanun uyarınca tüketicinin 14 gün içinde cayma hakkı vardır. Ancak dijital hizmetlerde, ifaya
        tüketicinin onayı ile anında başlandığı durumlarda cayma hakkı kullanılamaz (Mesafeli Sözleşmeler Yönetmeliği md. 15/ğ).
        Sipariş verirken hizmetin hemen başlayacağını kabul etmiş sayılırsınız.
      </p>

      <h2 className="text-xl font-bold">4. İade Koşulları</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li><strong>İade edilebilir:</strong> Hizmet hiç başlamadıysa (48 saat+), sistem hatası, yanlış miktar teslimi</li>
        <li><strong>İade edilemez:</strong> Tamamlanan veya kısmen teslim edilen siparişler, hatalı/gizli profil linki</li>
        <li><strong>Telafi:</strong> Telafi destekli servislerde düşüş için ücretsiz refill — <a href="/telafi-talebi" className="font-semibold text-[#7844E4]">telafi formu</a></li>
        <li><strong>İade yöntemi:</strong> Onaylanan iadeler panel bakiyesine veya ödeme yöntemine {LEGAL.refundDays} gün içinde</li>
      </ul>

      <h2 className="text-xl font-bold">5. Ödeme İadesi</h2>
      <p>
        Kart ile yapılan bakiye yüklemelerinde iade, yasal süreler içinde iyzico / banka süreçleri üzerinden yapılır.
        Havale ile yüklenen bakiyelerde iade aynı IBAN&apos;a veya panel bakiyesinde tutulur.
      </p>

      <h2 className="text-xl font-bold">6. İletişim</h2>
      <p>
        Tüm teslimat ve iade talepleri: {SITE.email} — {SITE.phone} —{' '}
        <a href="/iletisim" className="font-semibold text-[#7844E4]">İletişim sayfası</a>
      </p>
    </LegalPage>
  )
}
