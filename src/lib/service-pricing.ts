import { getService } from '@/lib/catalog'
import { formatTryPrice } from '@/lib/min-ticket-price'

export function getServiceStartingPrice(slug: string): number | null {
  const service = getService(slug)
  if (!service) return null
  let min = Infinity
  for (const tier of service.tiers) {
    for (const pkg of tier.packages) {
      if (pkg.price < min) min = pkg.price
    }
  }
  return min === Infinity ? null : min
}

export function formatStartingPrice(slug: string) {
  const price = getServiceStartingPrice(slug)
  return price != null ? `${formatTryPrice(price)} ₺` : null
}
