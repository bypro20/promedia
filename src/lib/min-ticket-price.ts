/** 2026 minimum paket taban fiyatları (₺) */
export function minTicketPrice(amount: number) {
  if (amount <= 50) return 12.9
  if (amount <= 100) return 19.9
  if (amount <= 250) return 34.9
  return 49.9
}

export function formatTryPrice(price: number) {
  return price.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
