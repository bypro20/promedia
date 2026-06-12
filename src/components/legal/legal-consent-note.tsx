import Link from 'next/link'

/** Ödeme / sipariş öncesi iyzico uyumlu onay metni */
export function LegalConsentNote() {
  return (
    <p className="text-[11px] leading-relaxed text-[#666F94]">
      Ödeme butonuna tıklayarak{' '}
      <Link href="/on-bilgilendirme-formu" className="font-semibold text-[#7844E4] hover:underline">
        Ön Bilgilendirme Formu
      </Link>
      &apos;nu okuduğunuzu,{' '}
      <Link href="/mesafeli-satis-sozlesmesi" className="font-semibold text-[#7844E4] hover:underline">
        Mesafeli Satış Sözleşmesi
      </Link>
      &apos;ni ve{' '}
      <Link href="/gizlilik-sozlesmesi" className="font-semibold text-[#7844E4] hover:underline">
        Gizlilik Sözleşmesi
      </Link>
      &apos;ni kabul etmiş sayılırsınız. Ödemeler{' '}
      <strong>iyzico</strong> güvenli ödeme altyapısı ile Visa / Mastercard kartlarından alınır.
    </p>
  )
}
