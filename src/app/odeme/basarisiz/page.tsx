import Link from 'next/link'

export default async function PaymentFailedPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>
}) {
  const { code } = await searchParams

  return (
    <main className="sd-container py-16">
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg">
        <p className="text-4xl">✕</p>
        <h1 className="mt-4 text-2xl font-black text-red-500">Ödeme Başarısız</h1>
        <p className="mt-3 text-sm font-semibold text-[#666F94]">
          Ödeme işlemi tamamlanamadı. Kart bilgilerinizi kontrol edip tekrar deneyebilirsiniz.
        </p>
        {code && <p className="mt-4 text-xs text-[#7A7F99]">Referans: {code}</p>}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-xl bg-[#7844E4] px-6 py-3 text-sm font-bold text-white hover:bg-[#6835d3]"
          >
            Tekrar Dene
          </Link>
          <Link
            href="/iletisim"
            className="rounded-xl border-2 border-[#E9EBF5] px-6 py-3 text-sm font-bold text-[#33353E] hover:bg-[#F0F1F9]"
          >
            Destek Al
          </Link>
        </div>
      </div>
    </main>
  )
}
