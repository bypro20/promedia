import { NextResponse } from 'next/server'
import { z } from 'zod'
import { authenticateApiKey, rateLimit } from '@/lib/api-v1-auth'
import { createOrder, formatOrderForClient } from '@/lib/smm/order-service'
import { logSecurity } from '@/lib/security'

const schema = z.object({
  service: z.string().min(3),
  tier: z.enum(['ucuz', 'standart', 'premium', 'gercek']),
  package: z.string().min(1),
  target: z.string().min(1),
})

export async function POST(req: Request) {
  const user = await authenticateApiKey(req.headers.get('authorization'))
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Invalid API key' }, { status: 401 })
  }
  if (!rateLimit(`v1:${user.id}`, 60)) {
    return NextResponse.json({ ok: false, error: 'Rate limit exceeded' }, { status: 429 })
  }

  try {
    const body = schema.parse(await req.json())
    const order = await createOrder({
      serviceSlug: body.service,
      tierId: body.tier,
      packageId: body.package,
      target: body.target,
      userId: user.id,
      payFromBalance: true,
    })

    void logSecurity('api_order', { target: user.email, detail: order.code })

    return NextResponse.json({
      ok: true,
      order: formatOrderForClient(order),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Order failed'
    return NextResponse.json({ ok: false, error: message }, { status: 400 })
  }
}
