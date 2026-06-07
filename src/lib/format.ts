export function formatAmount(n: number): string {
  if (n >= 1000) return `${n / 1000}K`
  return String(n)
}

export function formatPrice(n: number): string {
  return n.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
