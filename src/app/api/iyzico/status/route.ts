import { NextResponse } from 'next/server'
import { isIyzicoConfigured } from '@/lib/iyzico'
import {
  formatCommissionPercent,
  getIyzicoCommissionFixedTry,
  getIyzicoCommissionRate,
} from '@/lib/iyzico-commission'

export async function GET() {
  const rate = getIyzicoCommissionRate()
  return NextResponse.json({
    enabled: isIyzicoConfigured(),
    sandbox: process.env.IYZICO_SANDBOX === 'true',
    rate,
    rateLabel: formatCommissionPercent(rate),
    fixed: getIyzicoCommissionFixedTry(),
  })
}
