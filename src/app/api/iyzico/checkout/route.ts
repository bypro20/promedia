import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getClientIp } from '@/lib/client-ip'
import { getService } from '@/lib/catalog'
import { initializeCheckoutForm } from '@/lib/iyzico'
import { grossFromNet } from '@/lib/iyzico-commission'
import { siteBaseUrl } from '@/lib/paytr'
import { createPendingGuestOrder } from '@/lib/smm/order-service'
import { createOrderSchema } from '@/lib/validators/order'

const guestCheckoutSchema = createOrderSchema.extend({
  email: z.string().email(),
})

export async function POST(req: Request) {
  try {
    const body = guestCheckoutSchema.parse(await req.json())
    const service = getService(body.serviceSlug)
    if (!service) {
      return NextResponse.json({ ok: false, error: 'Hizmet bulunamadı' }, { status: 404 })
    }

    const order = await createPendingGuestOrder({
      serviceSlug: body.serviceSlug,
      tierId: body.tierId,
      packageId: body.packageId,
      target: body.target,
      email: body.email,
    })

    const breakdown = grossFromNet(order.price)
    const ip = getClientIp(req) || '127.0.0.1'
    const base = siteBaseUrl()
    const buyerName = body.email.split('@')[0] || 'Müşteri'

    const checkout = await initializeCheckoutForm({
      conversationId: order.code,
      basketId: order.code,
      priceTry: breakdown.gross,
      itemName: `${service.title} — ${order.amount} ${service.unit}`,
      callbackUrl: `${base}/api/iyzico/callback`,
      buyerEmail: body.email,
      buyerName,
      buyerIp: ip,
    })

    if ('error' in checkout) {
      const { failGuestOrderPayment } = await import('@/lib/smm/order-service')
      await failGuestOrderPayment(order.code)
      return NextResponse.json({ ok: false, error: checkout.error }, { status: 400 })
    }

    return NextResponse.json({
      ok: true,
      orderCode: order.code,
      token: checkout.token,
      checkoutFormContent: checkout.checkoutFormContent,
      paymentPageUrl: checkout.paymentPageUrl,
      net: breakdown.net,
      gross: breakdown.gross,
      commission: breakdown.commission,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: 'Geçersiz sipariş bilgisi' }, { status: 400 })
    }
    const message = err instanceof Error ? err.message : 'Ödeme başlatılamadı'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
