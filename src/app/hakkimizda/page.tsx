import type { Metadata } from 'next'
import Link from 'next/link'
import { HakkimizdaHero } from '@/components/marketing/hakkimizda-hero'
import { SellerInfoBlock } from '@/components/legal/seller-info-block'
import { LEGAL } from '@/lib/legal-config'
import { SITE } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Hakkımızda',
  description: 'ProMedia ekibi, kurumsal kimlik, satıcı bilgileri ve iletişim.',
}

export default function HakkimizdaPage() {
  return (
    <main>
      <HakkimizdaHero />

      <section className="border-t border-[#E4DAFA]/60 bg-[#F0F1F9]/50 py-14">
        <div className="sd-container max-w-3xl">
          <Link href="/" className="text-sm font-semibold text-[#7844E4] hover:underline">
            ← Ana Sayfa
          </Link>

          <SellerInfoBlock />

          <h2 className="mt-10 text-xl font-bold text-[#33353E]">Şirket Tanıtımı</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#666F94]">
            {LEGAL.tradeName}, {LEGAL.domain} alan adı üzerinden Instagram, TikTok, YouTube ve diğer sosyal medya
            platformları için takipçi, beğeni, izlenme ve etkileşim hizmetleri sunan dijital bir hizmet platformudur.
            {LEGAL.companyName} tarafından işletilmektedir.
          </p>

          <h2 className="mt-8 text-xl font-bold text-[#33353E]">İletişim</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[#666F94]">
            <li>
              E-posta:{' '}
              <a href={`mailto:${SITE.email}`} className="font-semibold text-[#7844E4]">
                {SITE.email}
              </a>
            </li>
            <li>Telefon: {SITE.phone}</li>
            <li>Adres: {LEGAL.address}</li>
            <li>Çalışma: {SITE.workingHours}</li>
          </ul>

          <h2 className="mt-8 text-xl font-bold text-[#33353E]">Güvenlik ve Ödeme</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#666F94]">
            Web sitemiz <strong>256-bit SSL</strong> sertifikası ile korunmaktadır. Kredi kartı ödemeleri{' '}
            <strong>iyzico</strong> güvenli ödeme altyapısı üzerinden Visa ve Mastercard ile alınır; kart bilgileriniz
            tarafımızca saklanmaz. Detay:{' '}
            <a href="/ssl-sertifikasi" className="font-semibold text-[#7844E4]">
              SSL Sertifikası
            </a>
            .
          </p>

          <h2 className="mt-8 text-xl font-bold text-[#33353E]">Hizmet Modeli</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#666F94]">
            <li>Dijital hizmet — fiziksel ürün gönderimi yapılmaz</li>
            <li>Şifre istemeyen, link tabanlı güvenli sipariş</li>
            <li>7/24 sipariş takibi ve destek</li>
            <li>Telafi (refill) garantisi — desteklenen servislerde</li>
          </ul>

          <p className="mt-10 text-xs text-[#666F94]">
            Son güncelleme:{' '}
            {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </section>
    </main>
  )
}
