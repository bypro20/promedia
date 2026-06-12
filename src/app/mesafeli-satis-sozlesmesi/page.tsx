import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal/legal-page'
import { SellerInfoBlock } from '@/components/legal/seller-info-block'
import { LEGAL } from '@/lib/legal-config'
import { SITE } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Mesafeli Satış Sözleşmesi',
  description: '6502 sayılı Kanun kapsamında ProMedia mesafeli satış sözleşmesi.',
}

export default function MesafeliSatisPage() {
  return (
    <LegalPage title="Mesafeli Satış Sözleşmesi" subtitle="6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında">
      <SellerInfoBlock />

      <h2 className="text-xl font-bold">Madde 1 — Taraflar</h2>
      <p>
        <strong>Satıcı:</strong> {LEGAL.companyName} (MERSİS: {LEGAL.mersisNo}, Vergi Dairesi: {LEGAL.taxOffice},{' '}
        Vergi No: {LEGAL.taxNo}) — {LEGAL.address} — {SITE.phone} — {SITE.email}
      </p>
      <p>
        <strong>Alıcı:</strong> Siteye kayıt olan ve/veya sipariş veren gerçek veya tüzel kişi tüketici.
      </p>

      <h2 className="text-xl font-bold">Madde 2 — Konu</h2>
      <p>
        İşbu sözleşmenin konusu, Alıcı&apos;nın {LEGAL.domain} üzerinden elektronik ortamda sipariş verdiği dijital sosyal
        medya hizmetlerinin (takipçi, beğeni, izlenme vb.) satışına ve ifasına ilişkin tarafların hak ve yükümlülüklerinin
        belirlenmesidir.
      </p>

      <h2 className="text-xl font-bold">Madde 3 — Hizmetin Niteliği ve Fiyat</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Hizmetler dijital niteliktedir; fiziksel gönderim yapılmaz</li>
        <li>Fiyatlar sitede KDV dahil Türk Lirası (₺) olarak gösterilir</li>
        <li>Ödeme: panel bakiyesi, kredi/banka kartı ({LEGAL.paymentMethods}) — {LEGAL.paymentProvider} altyapısı</li>
        <li>Sipariş anında bakiyeden düşülür; ardından otomatik olarak tedarikçi panele iletilir</li>
      </ul>

      <h2 className="text-xl font-bold">Madde 4 — Teslimat ve İfa</h2>
      <p>
        Hizmet, Alıcı tarafından sağlanan kullanıcı adı / link bilgisine göre elektronik ortamda ifa edilir. Teslimat
        süresi servis türüne göre değişmekle birlikte en geç <strong>{LEGAL.maxDeliveryDays} iş günü</strong> içinde
        başlatılır. Detaylı şartlar:{' '}
        <a href="/teslimat-iade-sartlari" className="font-semibold text-[#7844E4]">Teslimat ve İade Şartları</a>.
      </p>

      <h2 className="text-xl font-bold">Madde 5 — Cayma Hakkı</h2>
      <p>
        Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15. maddesi uyarınca, elektronik ortamda anında ifa edilen dijital
        hizmetlerde, hizmet ifasına Alıcı&apos;nın açık onayı ile başlandığı takdirde cayma hakkı kullanılamaz. Alıcı,
        sipariş vermeden önce hizmetin anında başlayacağını kabul eder. Hizmet hiç başlamamışsa{' '}
        {LEGAL.refundDays} gün içinde {SITE.email} üzerinden talep değerlendirilir.
      </p>

      <h2 className="text-xl font-bold">Madde 6 — Alıcı Yükümlülükleri</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Doğru ve herkese açık profil / gönderi linki sağlamak</li>
        <li>Hesap şifresini paylaşmamak</li>
        <li>Platform kurallarına aykırı kullanımdan kaçınmak</li>
      </ul>

      <h2 className="text-xl font-bold">Madde 7 — Uyuşmazlık</h2>
      <p>
        Uyuşmazlıklarda Alıcı, Tüketici Hakem Heyetlerine veya Tüketici Mahkemelerine başvurabilir. Güncel parasal
        sınırlar için Ticaret Bakanlığı duyurularına bakınız.
      </p>

      <h2 className="text-xl font-bold">Madde 8 — Yürürlük</h2>
      <p>
        Alıcı, sipariş / ödeme adımında bu sözleşmeyi okuduğunu ve kabul ettiğini beyan eder. Sözleşme elektronik ortamda
        saklanır ve talep halinde e-posta ile iletilir.
      </p>
    </LegalPage>
  )
}
