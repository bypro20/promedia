import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import {
  adminCancelOrder,
  adminRefundOrder,
  adminResubmitOrder,
  formatOrderForClient,
  lookupOrder,
} from '@/lib/smm/order-service'

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
    const { code, action } = await req.json() as { code: string; action: string }

    switch (action) {
      case 'refresh': {
        const order = await lookupOrder(code)
        return NextResponse.json({ ok: true, order: formatOrderForClient(order) })
      }
      case 'cancel': {
        const order = await adminCancelOrder(code)
        return NextResponse.json({ ok: true, order })
      }
      case 'refund': {
        const order = await adminRefundOrder(code)
        return NextResponse.json({ ok: true, order })
      }
      case 'resubmit': {
        const order = await adminResubmitOrder(code)
        return NextResponse.json({ ok: true, order })
      }
      default:
        return NextResponse.json({ ok: false, error: 'Geçersiz işlem' }, { status: 400 })
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'İşlem başarısız'
    return NextResponse.json({ ok: false, error: message }, { status: 400 })
  }
}
