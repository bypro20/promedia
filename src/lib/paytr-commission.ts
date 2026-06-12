/** PayTR komisyonu müşteriye yansır — env ile ayarlanır */

export function getPaytrCommissionRate() {
  return Number(process.env.PAYTR_COMMISSION_RATE ?? 0.0299)
}

export function getPaytrCommissionFixedTry() {
  return Number(process.env.PAYTR_COMMISSION_FIXED ?? 0.25)
}

export type PaytrCommissionBreakdown = {
  net: number
  gross: number
  commission: number
  rate: number
  fixed: number
}

/** Net bakiye tutarından müşterinin ödeyeceği brüt tutarı hesapla */
export function grossFromNet(netAmountTry: number): PaytrCommissionBreakdown {
  const rate = getPaytrCommissionRate()
  const fixed = getPaytrCommissionFixedTry()
  const net = Math.round(netAmountTry * 100) / 100
  const gross = Math.ceil(((net + fixed) / (1 - rate)) * 100) / 100
  const commission = Math.round((gross - net) * 100) / 100
  return { net, gross, commission, rate, fixed }
}

/** Brüt ödemeden net bakiye (doğrulama için) */
export function netFromGross(grossAmountTry: number): number {
  const rate = getPaytrCommissionRate()
  const fixed = getPaytrCommissionFixedTry()
  const net = grossAmountTry * (1 - rate) - fixed
  return Math.round(Math.max(0, net) * 100) / 100
}

export function formatCommissionPercent(rate: number) {
  return `%${(rate * 100).toFixed(2).replace(/\.?0+$/, '')}`
}
