import type { FaqItem } from '@/lib/packages'

type Props = { items?: FaqItem[] }

const DEFAULT: FaqItem[] = [
  { q: 'Satın almak güvenli mi?', a: 'ProMedia yalnızca kullanıcı adınızı ister; şifre asla istenmez. 3D Secure ile güvenli ödeme.' },
  { q: 'Teslimat ne kadar sürer?', a: 'Çoğu sipariş 0–15 dakikada başlar. Büyük paketler kademeli tamamlanır.' },
  { q: 'Telafi nasıl yapılır?', a: 'Telafi Talebi sayfasından sipariş kodunuzla başvuru yapabilirsiniz.' },
]

export function FaqSection({ items = DEFAULT }: Props) {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-center text-2xl font-black">Sıkça Sorulan Sorular</h2>
        <div className="mt-8 space-y-3">
          {items.map((item) => (
            <details key={item.q} className="group rounded-2xl border-2 border-purple-light bg-purple-light/20 px-5 py-4">
              <summary className="cursor-pointer list-none font-semibold [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {item.q}
                  <svg className="h-4 w-4 shrink-0 text-purple transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
