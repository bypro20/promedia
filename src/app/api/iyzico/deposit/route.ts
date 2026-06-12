import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getClientIp } from '@/lib/client-ip'
import { createIyzicoDepositRequest } from '@/lib/deposits'
import { generateDepositPaymentRef, initializeCheckoutForm, isIyzicoConfigured } from '@/lib/iyzico'
import { grossFromNet } from '@/lib/iyzico-commission'
import { requireCustomerSession } from '@/lib/panel-auth'
import { siteBaseUrl } from '@/lib/paytr'

const schema = z.object({
  amount: z.number().min(10).max(50000),
})

export async function POST(req: Request) {
  try {
    if (!isIyzicoConfigured()) {
      return NextResponse.json({ ok: false, error: 'Kart ödemesi henüz yapılandırılmamış' }, { status: 503 })
    }

    const user = await requireCustomerSession()
    const body = schema.parse(await req.json())
    const breakdown = grossFromNet(body.amount)
    const paymentRef = generateDepositPaymentRef(user.id)

    await createIyzicoDepositRequest({
      userId: user.id,
      netAmount: breakdown.net,
      grossAmount: breakdown.gross,
      commissionAmount: breakdown.commission,
      paymentRef,
    })

    const base = siteBaseUrl()
    const ip = getClientIp(req) || '127.0.0.1'
    const checkout = await initializeCheckoutForm({
      conversationId: paymentRef,
      basketId: paymentRef,
      priceTry: breakdown.gross,
      itemName: `ProMedia Bakiye ${breakdown.net.toFixed(2)} TL`,
      callbackUrl: `${base}/api/iyzico/callback`,
      buyerEmail: user.email,
      buyerName: user.name || user.email.split('@')[0],
      buyerIp: ip,
    })

    if ('error' in checkout) {
      await import('@/lib/deposits').then(({ failIyzicoDeposit }) => failIyzicoDeposit(paymentRef, checkout.error))
      return NextResponse.json({ ok: false, error: checkout.error }, { status: 502 })
    }

    return NextResponse.json({
      ok: true,
      token: checkout.token,
      checkoutFormContent: checkout.checkoutFormContent,
      paymentPageUrl: checkout.paymentPageUrl,
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
