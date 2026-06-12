/** iyzico komisyonu müşteriye yansır — env ile ayarlanır */

export function getIyzicoCommissionRate() {
  return Number(process.env.IYZICO_COMMISSION_RATE ?? 0.0299)
}

export function getIyzicoCommissionFixedTry() {
  return Number(process.env.IYZICO_COMMISSION_FIXED ?? 0.25)
}

export type IyzicoCommissionBreakdown = {
  net: number
  gross: number
  commission: number
}

export function grossFromNet(netAmountTry: number): IyzicoCommissionBreakdown {
  const rate = getIyzicoCommissionRate()
  const fixed = getIyzicoCommissionFixedTry()
  const n = Math.max(0, netAmountTry)
  const gross = Math.ceil(((n + fixed) / (1 - rate)) * 100) / 100
  const commission = Math.round((gross - n) * 100) / 100
  return { net: n, gross, commission }
}

export function formatCommissionPercent(rate: number) {
  return `%${(rate * 100).toFixed(2).replace(/\.?0+$/, '')}`
}
