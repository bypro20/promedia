import type { FaqItem } from '@/lib/packages'

type Props = { items?: FaqItem[] }

const DEFAULT: FaqItem[] = [
  { q: 'Instagram takipçi satın al hizmeti güvenilir midir?', a: 'ProMedia yalnızca kullanıcı adınızı ister; şifre asla istenmez. 3D Secure ile güvenli ödeme altyapısı kullanılır.' },
  { q: 'Takipçi satın al hizmetleri ne kadar sürede iletilir?', a: 'Çoğu sipariş 0–15 dakikada başlar. Büyük paketler kademeli tamamlanır.' },
  { q: 'Telafi nasıl yapılır?', a: 'Telafi Talebi sayfasından sipariş kodunuzla başvuru yapabilirsiniz.' },
  { q: 'Sipariş takibi nasıl yapılır?', a: 'Ana sayfadaki Sipariş Sorgula butonuna tıklayarak sipariş numaranızı girebilirsiniz.' },
]

export function FaqSection({ items = DEFAULT }: Props) {
  return (
    <section className="bg-[#F0F1F9] py-14">
      <div className="sd-container max-w-3xl">
        <h2 className="text-center text-2xl font-semibold text-[#33353E]">
          S.S.S — <span className="text-[#7844E4]">Sıkça Sorulan Sorular</span>
        </h2>
        <div className="mt-8 space-y-3">
          {items.map((item) => (
            <details key={item.q} className="group rounded-2xl border border-[#E9EBF5] bg-white px-5 py-4">
              <summary className="cursor-pointer list-none font-semibold text-[#33353E] [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {item.q}
                  <svg className="h-4 w-4 shrink-0 text-[#7844E4] transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[#666F94]">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
