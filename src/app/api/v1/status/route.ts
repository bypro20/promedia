import { NextResponse } from 'next/server'
import { authenticateApiKey, rateLimit } from '@/lib/api-v1-auth'
import { formatOrderForClient, lookupOrder } from '@/lib/smm/order-service'
import { prisma } from '@/lib/db'

export async function GET(req: Request) {
  const user = await authenticateApiKey(req.headers.get('authorization'))
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Invalid API key' }, { status: 401 })
  }
  if (!rateLimit(`v1:${user.id}`, 120)) {
    return NextResponse.json({ ok: false, error: 'Rate limit exceeded' }, { status: 429 })
  }

  const code = new URL(req.url).searchParams.get('order')
  if (!code) {
    return NextResponse.json({ ok: false, error: 'order parameter required' }, { status: 400 })
  }

  const owned = await prisma.order.findFirst({
    where: { code: code.trim().toUpperCase(), userId: user.id },
  })
  if (!owned) {
    return NextResponse.json({ ok: false, error: 'Order not found' }, { status: 404 })
  }

  const order = await lookupOrder(code)
  return NextResponse.json({ ok: true, order: formatOrderForClient(order) })
}
