import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getClientIp } from '@/lib/client-ip'
import { requireCustomerSession } from '@/lib/panel-auth'
import { createPaytrDepositRequest } from '@/lib/deposits'
import { grossFromNet } from '@/lib/paytr-commission'
import {
  createPaymentToken,
  generateDepositMerchantOid,
  isPaytrConfigured,
  siteBaseUrl,
} from '@/lib/paytr'

const schema = z.object({
  amount: z.number().min(10).max(50000),
})

export async function POST(req: Request) {
  try {
    if (!isPaytrConfigured()) {
      return NextResponse.json({ ok: false, error: 'PayTR henüz yapılandırılmadı' }, { status: 503 })
    }

    const user = await requireCustomerSession()
    const body = schema.parse(await req.json())
    const breakdown = grossFromNet(body.amount)
    const merchantOid = generateDepositMerchantOid(user.id)

    await createPaytrDepositRequest({
      userId: user.id,
      netAmount: breakdown.net,
      grossAmount: breakdown.gross,
      commissionAmount: breakdown.commission,
      merchantOid,
    })

    const base = siteBaseUrl()
    const ip = getClientIp(req) || '127.0.0.1'
    const tokenRes = await createPaymentToken({
      merchantOid,
      userEmail: user.email,
      userName: user.name || user.email.split('@')[0],
      userIp: ip,
      paymentAmountGross: breakdown.gross,
      basketLabel: `ProMedia Bakiye ${breakdown.net.toFixed(2)} TL`,
      okUrl: `${base}/panel/bakiye?payment=success`,
      failUrl: `${base}/panel/bakiye?payment=failed`,
    })

    if (!tokenRes.ok) {
      return NextResponse.json({ ok: false, error: tokenRes.error }, { status: 502 })
    }

    return NextResponse.json({
      ok: true,
      token: tokenRes.token,
      merchantOid,
      net: breakdown.net,
      gross: breakdown.gross,
      commission: breakdown.commission,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: 'Geçersiz tutar (10–50.000 ₺)' }, { status: 400 })
    }
    const message = err instanceof Error ? err.message : 'Ödeme başlatılamadı'
    return NextResponse.json({ ok: false, error: message }, { status: 400 })
  }
}
