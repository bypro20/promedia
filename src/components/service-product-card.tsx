import type { ServiceDefinition } from '@/lib/packages'
import { formatStartingPrice } from '@/lib/service-pricing'

type Props = { service: ServiceDefinition }

export function ServiceProductCard({ service }: Props) {
  const fromPrice = formatStartingPrice(service.slug)

  return (
    <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-[#E9EBF5] bg-white p-5 shadow-sm">
      <div
        className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl text-5xl shadow-inner"
        style={{ backgroundColor: service.platformColorLight }}
      >
        {service.platformIcon}
      </div>
      <div className="min-w-[200px] flex-1">
        <p className="text-sm font-bold uppercase tracking-wide text-[#666F94]">{service.platform}</p>
        <p className="mt-1 text-lg font-black text-[#33353E]">{service.unit} Paketleri</p>
        {fromPrice && (
          <p className="mt-1 text-2xl font-black" style={{ color: service.platformColor }}>
            {fromPrice}&apos;den başlayan fiyatlar
          </p>
        )}
        <p className="mt-1 text-sm text-[#666F94]">Sepete ekle · iyzico 3D Secure · Anında teslimat</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {['Ucuz Global', 'Standart', 'Premium', 'VIP'].map((label) => (
          <span
            key={label}
            className="rounded-full px-3 py-1 text-xs font-bold text-white"
            style={{ backgroundColor: service.platformColor }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
