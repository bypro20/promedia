import { NextResponse } from 'next/server'
import { z } from 'zod'
import { formatOrderForClient, lookupOrder, refillOrder } from '@/lib/smm/order-service'
import { refillOrderSchema } from '@/lib/validators/order'

import { getSession } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = refillOrderSchema.parse(body)
    const session = await getSession()
    const updated = await refillOrder(parsed.code, parsed.email ?? '', session?.id)
    const order = await lookupOrder(updated.code)

    return NextResponse.json({
      ok: true,
      message: 'Telafi talebiniz alındı. İşlem birkaç saat içinde başlayacaktır.',
      order: formatOrderForClient(order),
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: 'Geçersiz bilgi' }, { status: 400 })
    }
    const message = err instanceof Error ? err.message : 'Telafi talebi başarısız'
    return NextResponse.json({ ok: false, error: message }, { status: 400 })
  }
}
