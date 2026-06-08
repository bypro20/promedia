import { NextResponse } from 'next/server'
import { requireCustomerSession } from '@/lib/panel-auth'
import { prisma } from '@/lib/db'
import { getService } from '@/lib/catalog'

export async function GET() {
  try {
    const user = await requireCustomerSession()
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        code: true,
        status: true,
        serviceSlug: true,
        amount: true,
        price: true,
        createdAt: true,
      },
    })
    return NextResponse.json({
      ok: true,
      orders: orders.map((o) => ({
        ...o,
        serviceTitle: getService(o.serviceSlug)?.title ?? o.serviceSlug,
        createdAt: o.createdAt.toISOString(),
      })),
    })
  } catch {
    return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 401 })
  }
}
