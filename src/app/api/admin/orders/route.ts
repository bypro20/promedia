import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { lookupOrder } from '@/lib/smm/order-service'
import { formatOrderForClient } from '@/lib/smm/order-service'

export async function GET() {
  try {
    await requireAdmin()
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: { user: { select: { email: true, name: true } } },
    })
    return NextResponse.json({ ok: true, orders })
  } catch {
    return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 403 })
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin()
    const { code, action } = await req.json() as { code: string; action: 'refresh' }
    if (action === 'refresh') {
      const order = await lookupOrder(code)
      return NextResponse.json({ ok: true, order: formatOrderForClient(order) })
    }
    return NextResponse.json({ ok: false, error: 'Geçersiz işlem' }, { status: 400 })
  } catch {
    return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 403 })
  }
}
