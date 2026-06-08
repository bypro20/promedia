import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal/legal-page'
import { SITE } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni',
  description: 'ProMedia kişisel verilerin korunması ve KVKK aydınlatma metni.',
}

export default function KvkkPage() {
  return (
    <LegalPage title="KVKK Aydınlatma Metni" subtitle="6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında">
      <p>
        {SITE.name} olarak kişisel verilerinizin güvenliğine önem veriyoruz. Bu metin, veri sorumlusu sıfatıyla
        hangi verileri topladığımızı ve nasıl işlediğimizi açıklar.
      </p>
      <h2 className="text-xl font-bold">Toplanan Veriler</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Kimlik ve iletişim: ad, e-posta adresi</li>
        <li>Hesap: şifre (hash), Google OAuth kimliği</li>
        <li>İşlem: sipariş geçmişi, bakiye hareketleri, IP adresi (güvenlik)</li>
        <li>Destek: ticket mesajları</li>
      </ul>
      <h2 className="text-xl font-bold">İşleme Amaçları</h2>
      <p>
        Hizmet sunumu, sipariş takibi, müşteri desteği, dolandırıcılık önleme, yasal yükümlülüklerin yerine getirilmesi
        ve panel güvenliğinin sağlanması.
      </p>
      <h2 className="text-xl font-bold">Haklarınız</h2>
      <p>
        KVKK md. 11 kapsamında verilerinize erişim, düzeltme, silme ve itiraz haklarına sahipsiniz.
        Taleplerinizi {SITE.email} adresine iletebilirsiniz.
      </p>
    </LegalPage>
  )
}
