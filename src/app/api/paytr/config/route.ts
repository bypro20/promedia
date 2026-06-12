import { NextResponse } from 'next/server'
import {
  formatCommissionPercent,
  getPaytrCommissionFixedTry,
  getPaytrCommissionRate,
  grossFromNet,
} from '@/lib/paytr-commission'
import { isPaytrConfigured } from '@/lib/paytr'

export async function GET() {
  const rate = getPaytrCommissionRate()
  const fixed = getPaytrCommissionFixedTry()
  const sample = grossFromNet(100)

  return NextResponse.json({
    ok: true,
    enabled: isPaytrConfigured() && process.env.NEXT_PUBLIC_PAYTR_ENABLED === 'true',
    rate,
    fixed,
    rateLabel: formatCommissionPercent(rate),
    sample100: sample,
  })
}
