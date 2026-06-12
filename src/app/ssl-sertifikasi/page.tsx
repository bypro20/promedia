import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal/legal-page'
import { LEGAL } from '@/lib/legal-config'
import { SITE } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'SSL Sertifikası',
  description: `${SITE.domain} SSL/TLS güvenlik sertifikası bilgileri.`,
}

export default function SslPage() {
  const siteUrl = `https://${LEGAL.domain}`

  return (
    <LegalPage title="SSL Sertifikası" subtitle="Güvenli bağlantı ve veri şifreleme">
      <p>
        {LEGAL.tradeName} ({siteUrl}) web sitesi, ziyaretçi ve müşteri verilerinin güvenliği için{' '}
        <strong>SSL/TLS (HTTPS)</strong> sertifikası kullanmaktadır.
      </p>

      <h2 className="text-xl font-bold">SSL Nedir?</h2>
      <p>
        SSL (Secure Sockets Layer) / TLS, tarayıcınız ile sunucumuz arasındaki veri trafiğini şifreleyen güvenlik
        protokolüdür. Adres çubuğunda kilit simgesi ve <code>https://</code> öneki bu korumayı gösterir.
      </p>

      <h2 className="text-xl font-bold">Sitemizdeki Güvenlik Önlemleri</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>256-bit SSL/TLS şifreleme</li>
        <li>Otomatik sertifika yenileme (Let&apos;s Encrypt / Vercel)</li>
        <li>HTTPS zorunlu yönlendirme — tüm sayfalar güvenli bağlantı ile sunulur</li>
        <li>Ödeme işlemleri iyzico PCI-DSS uyumlu altyapı üzerinden; kart bilgileri sitemizde işlenmez</li>
        <li>Oturum çerezleri güvenli (HttpOnly) bayraklarla korunur</li>
      </ul>

      <h2 className="text-xl font-bold">Sertifika Doğrulama</h2>
      <p>
        Tarayıcınızın adres çubuğundaki kilit simgesine tıklayarak sertifika detaylarını görüntüleyebilirsiniz.
        Sertifika sahibi: <strong>{LEGAL.domain}</strong>
      </p>

      <h2 className="text-xl font-bold">Ödeme Güvenliği</h2>
      <p>
        Kredi kartı ödemeleri {LEGAL.paymentProvider} altyapısı ile alınır. Visa, Mastercard ve Troy logoları iyzico
        güvenli ödeme bandında gösterilir. Kart bilgileriniz yalnızca lisanslı ödeme kuruluşu tarafından işlenir.
      </p>

      <div className="not-prose mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        <p className="font-bold">✓ Bu site güvenli bağlantı kullanıyor</p>
        <p className="mt-1">{siteUrl} — SSL aktif</p>
      </div>
    </LegalPage>
  )
}
