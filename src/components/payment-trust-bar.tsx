import Link from 'next/link'

type Props = {
  variant?: 'light' | 'dark'
  showLinks?: boolean
}

export function PaymentTrustBar({ variant = 'dark', showLinks = true }: Props) {
  const isDark = variant === 'dark'

  return (
    <div className={`flex flex-col items-center gap-4 ${isDark ? 'text-white/70' : 'text-[#666F94]'}`}>
      <div className="rounded-xl bg-white px-6 py-3 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/payment/iyzico-band.svg"
          alt="iyzico ile Öde — Visa, Mastercard, Troy"
          width={429}
          height={32}
          className="h-8 w-auto min-w-[280px] max-w-full sm:min-w-[360px]"
        />
      </div>
      {showLinks && (
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] font-semibold">
          <Link href="/mesafeli-satis-sozlesmesi" className={isDark ? 'hover:text-white' : 'text-[#7844E4] hover:underline'}>
            Mesafeli Satış
          </Link>
          <Link href="/gizlilik-sozlesmesi" className={isDark ? 'hover:text-white' : 'text-[#7844E4] hover:underline'}>
            Gizlilik
          </Link>
          <Link href="/teslimat-iade-sartlari" className={isDark ? 'hover:text-white' : 'text-[#7844E4] hover:underline'}>
            Teslimat & İade
          </Link>
          <Link href="/ssl-sertifikasi" className={isDark ? 'hover:text-white' : 'text-[#7844E4] hover:underline'}>
            SSL
          </Link>
        </div>
      )}
    </div>
  )
}
