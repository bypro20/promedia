import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal/legal-page'
import { SellerInfoBlock } from '@/components/legal/seller-info-block'
import { LEGAL } from '@/lib/legal-config'
import { SITE } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Ön Bilgilendirme Formu',
  description: 'Mesafeli Sözleşmeler Yönetmeliği md. 5 kapsamında ön bilgilendirme.',
}

export default function OnBilgilendirmePage() {
  return (
    <LegalPage title="Ön Bilgilendirme Formu" subtitle="Mesafeli Sözleşmeler Yönetmeliği Madde 5">
      <SellerInfoBlock />

      <p>
        Aşağıdaki bilgiler, sipariş / ödeme öncesinde tüketiciye sunulması zorunlu ön bilgilendirme formudur.
      </p>

      <h2 className="text-xl font-bold">Satıcı Bilgileri</h2>
      <p>
        {LEGAL.companyName} — {LEGAL.address} — {SITE.phone} — {SITE.email} — MERSİS: {LEGAL.mersisNo}
      </p>

      <h2 className="text-xl font-bold">Hizmetin Temel Nitelikleri</h2>
      <p>
        Sosyal medya platformları için dijital etkileşim hizmetleri (takipçi, beğeni, izlenme, abone vb.). Dijital
        nitelikte, elektronik ortamda ifa edilir. Fiziksel ürün gönderilmez.
      </p>

      <h2 className="text-xl font-bold">Vergiler Dahil Toplam Fiyat</h2>
      <p>
        Sipariş ekranında gösterilen tutar KDV dahil toplam fiyattır. Ek gizli masraf yoktur. Kart ile bakiye yüklemede
        iyzico işlem komisyonu ayrıca gösterilir.
      </p>

      <h2 className="text-xl font-bold">Ödeme ve Teslimat</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Ödeme: Panel bakiyesi veya kredi/banka kartı ({LEGAL.paymentMethods})</li>
        <li>Ödeme altyapısı: {LEGAL.paymentProvider}</li>
        <li>Teslimat: Dijital — ödeme sonrası otomatik SMM paneline iletilir</li>
        <li>Teslimat süresi: Anında — en geç {LEGAL.maxDeliveryDays} iş günü</li>
      </ul>

      <h2 className="text-xl font-bold">Cayma Hakkı</h2>
      <p>
        Dijital hizmet ifasına açık onayınız ile anında başlandığından cayma hakkı kullanılamaz. Hizmet başlamadan
        iptal talepleri {SITE.email} üzerinden değerlendirilir. Detay:{' '}
        <a href="/teslimat-iade-sartlari" className="font-semibold text-[#7844E4]">Teslimat ve İade Şartları</a>.
      </p>

      <h2 className="text-xl font-bold">Şikayet ve Uyuşmazlık</h2>
      <p>
        Şikayetler: {SITE.email}. Uyuşmazlıklarda {LEGAL.disputeAuthority} yetkilidir.
      </p>

      <p className="rounded-xl bg-[#F0F1F9] p-4 text-sm">
        Sipariş veya ödeme butonuna basarak bu formu okuduğunuzu,{' '}
        <a href="/mesafeli-satis-sozlesmesi" className="font-semibold text-[#7844E4]">Mesafeli Satış Sözleşmesi</a>
        &apos;ni kabul ettiğinizi beyan etmiş olursunuz.
      </p>
    </LegalPage>
  )
}
