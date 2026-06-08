import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createOrder, formatOrderForClient, lookupOrder } from '@/lib/smm/order-service'
import { createOrderSchema, lookupOrderSchema } from '@/lib/validators/order'
import { getSession } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = createOrderSchema.parse(body)
    const session = await getSession()
    const payFromBalance = Boolean(body.payFromBalance && session)

    const order = await createOrder({
      serviceSlug: parsed.serviceSlug,
      tierId: parsed.tierId,
      packageId: parsed.packageId,
      target: parsed.target,
      email: parsed.email || session?.email,
      userId: session?.id,
      payFromBalance,
    })

    return NextResponse.json({
      ok: true,
      order: formatOrderForClient(order),
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: 'Geçersiz sipariş bilgisi' }, { status: 400 })
    }
    const message = err instanceof Error ? err.message : 'Sipariş oluşturulamadı'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code') ?? ''
    lookupOrderSchema.parse({ code })

    const order = await lookupOrder(code)
    if (!order) {
      return NextResponse.json({ ok: false, error: 'Sipariş bulunamadı' }, { status: 404 })
    }

    return NextResponse.json({
      ok: true,
      order: formatOrderForClient(order),
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: 'Geçersiz sipariş kodu' }, { status: 400 })
    }
    const message = err instanceof Error ? err.message : 'Sorgulama başarısız'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
