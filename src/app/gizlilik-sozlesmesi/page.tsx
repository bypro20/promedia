import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal/legal-page'
import { SellerInfoBlock } from '@/components/legal/seller-info-block'
import { LEGAL } from '@/lib/legal-config'
import { SITE } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Gizlilik Sözleşmesi',
  description: 'ProMedia gizlilik politikası ve kişisel veri işleme esasları.',
}

export default function GizlilikPage() {
  return (
    <LegalPage title="Gizlilik Sözleşmesi" subtitle="Kişisel verilerinizin korunması">
      <SellerInfoBlock />

      <p>
        Bu Gizlilik Sözleşmesi, {LEGAL.companyName} (&quot;{LEGAL.tradeName}&quot;) tarafından {LEGAL.domain} üzerinden
        sunulan hizmetler kapsamında toplanan kişisel verilerin işlenmesine ilişkin esasları düzenler. KVKK kapsamındaki
        aydınlatma için ayrıca <a href="/kvkk" className="font-semibold text-[#7844E4]">KVKK Aydınlatma Metni</a> geçerlidir.
      </p>

      <h2 className="text-xl font-bold">1. Veri Sorumlusu</h2>
      <p>{LEGAL.companyName} — {LEGAL.address} — {SITE.email}</p>

      <h2 className="text-xl font-bold">2. Toplanan Veriler</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Kimlik ve iletişim: ad, soyad, e-posta, telefon</li>
        <li>Hesap: şifre (şifrelenmiş), oturum kayıtları</li>
        <li>İşlem: sipariş geçmişi, bakiye hareketleri, ödeme referansları</li>
        <li>Teknik: IP adresi, tarayıcı bilgisi, çerez verileri (güvenlik ve analitik)</li>
        <li>Ödeme: Kart bilgileri <strong>iyzico</strong> tarafından işlenir; tarafımızca saklanmaz</li>
      </ul>

      <h2 className="text-xl font-bold">3. İşleme Amaçları</h2>
      <p>
        Hizmet sunumu, sipariş ifası, müşteri desteği, ödeme işlemleri, dolandırıcılık önleme, yasal yükümlülüklerin
        yerine getirilmesi ve site güvenliğinin sağlanması.
      </p>

      <h2 className="text-xl font-bold">4. Veri Paylaşımı</h2>
      <p>
        Verileriniz yalnızca hizmetin ifası için gerekli tedarikçiler (SMM API sağlayıcıları), ödeme kuruluşu (
        {LEGAL.paymentProvider}) ve yasal zorunluluk halinde yetkili kamu kurumları ile paylaşılabilir. Üçüncü taraflara
        satış yapılmaz.
      </p>

      <h2 className="text-xl font-bold">5. Saklama Süresi</h2>
      <p>
        Veriler, işleme amacının gerektirdiği süre ve ilgili mevzuattaki zamanaşımı süreleri boyunca saklanır; süre
        sonunda silinir, yok edilir veya anonim hale getirilir.
      </p>

      <h2 className="text-xl font-bold">6. Haklarınız</h2>
      <p>
        KVKK md. 11 kapsamında erişim, düzeltme, silme, işlemeyi kısıtlama ve itiraz haklarına sahipsiniz. Taleplerinizi{' '}
        {SITE.email} adresine iletebilirsiniz.
      </p>

      <h2 className="text-xl font-bold">7. Güvenlik</h2>
      <p>
        Site trafiği SSL/TLS ile şifrelenir. Ödeme işlemleri PCI-DSS uyumlu iyzico altyapısı üzerinden gerçekleştirilir.
      </p>
    </LegalPage>
  )
}
