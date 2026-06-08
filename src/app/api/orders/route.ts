import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createOrder, formatOrderForClient, lookupOrder } from '@/lib/smm/order-service'
import { ensureSmmKeyCache } from '@/lib/smm/key-store'
import { createOrderSchema, lookupOrderSchema } from '@/lib/validators/order'
import { getSession } from '@/lib/auth'

function clientErrorStatus(message: string) {
  if (/bulunamad|geçersiz|yetersiz|eşleşm/i.test(message)) return 400
  return 500
}

export async function POST(req: Request) {
  try {
    await ensureSmmKeyCache()
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
    return NextResponse.json({ ok: false, error: message }, { status: clientErrorStatus(message) })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code') ?? ''
    const email = searchParams.get('email') ?? ''
    lookupOrderSchema.parse({ code, email })

    const order = await lookupOrder(code)
    if (!order) {
      return NextResponse.json({ ok: false, error: 'Sipariş bulunamadı' }, { status: 404 })
    }

    const session = await getSession()
    if (session) {
      if (order.userId && order.userId !== session.id) {
        return NextResponse.json({ ok: false, error: 'Bu sipariş size ait değil' }, { status: 403 })
      }
    } else {
      const orderEmail = (order.email ?? '').toLowerCase()
      if (!email || orderEmail !== email.toLowerCase()) {
        return NextResponse.json(
          { ok: false, error: 'Misafir sorgulama için sipariş kodu ve kayıtlı e-posta gerekli' },
          { status: 400 }
        )
      }
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
