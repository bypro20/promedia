import { NextResponse } from 'next/server'
import { requireCustomerSession } from '@/lib/panel-auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const user = await requireCustomerSession()

    const [pendingDeposit, recentOrders] = await Promise.all([
      prisma.depositRequest.findFirst({ where: { userId: user.id, status: 'pending' } }),
      prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: { code: true, status: true, updatedAt: true },
      }),
    ])

    const items: Array<{ type: string; message: string; href?: string }> = []

    if (pendingDeposit) {
      items.push({
        type: 'deposit',
        message: `${pendingDeposit.amount.toFixed(2)} ₺ bakiye talebiniz onay bekliyor`,
        href: '/panel/bakiye',
      })
    }

    for (const o of recentOrders) {
      if (['completed', 'failed'].includes(o.status)) {
        items.push({
          type: 'order',
          message: `Sipariş ${o.code}: ${o.status}`,
          href: `/panel/siparisler/${o.code}`,
        })
      }
    }

    return NextResponse.json({ ok: true, count: items.length, items })
  } catch {
    return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 401 })
  }
}
