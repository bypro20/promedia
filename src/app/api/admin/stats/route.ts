import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { countPendingDeposits } from '@/lib/deposits'
import { SUPPORT_TICKET_FILTER } from '@/lib/ticket-utils'
import { prisma } from '@/lib/db'
import { getProfitSummary } from '@/lib/priced-catalog'
import { isSmmConfigured } from '@/lib/smm/providers'

export async function GET() {
  try {
    const admin = await requireAdmin()

    const [
      userCount,
      adminCount,
      orderCount,
      revenue,
      activeOrders,
      pendingDeposits,
      openSupport,
      recentOrders,
      recentDeposits,
      adminUser,
      profitSummary,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'user' } }),
      prisma.user.count({ where: { role: 'admin' } }),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { price: true } }),
      prisma.order.count({ where: { status: { in: ['pending', 'processing', 'in_progress'] } } }),
      countPendingDeposits(),
      prisma.ticket.count({ where: { status: 'open', ...SUPPORT_TICKET_FILTER } }),
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: { user: { select: { email: true } } },
      }),
      prisma.depositRequest.findMany({
        where: { status: 'pending' },
        orderBy: { createdAt: 'asc' },
        take: 5,
        include: { user: { select: { email: true, balance: true } } },
      }),
      prisma.user.findUnique({ where: { id: admin.id }, select: { balance: true, email: true } }),
      getProfitSummary(),
    ])

    return NextResponse.json({
      ok: true,
      stats: {
        users: userCount,
        admins: adminCount,
        orders: orderCount,
        revenue: revenue._sum.price ?? 0,
        activeOrders,
        pendingDeposits,
        openSupport,
        adminBalance: adminUser?.balance ?? 0,
        smmConfigured: isSmmConfigured(),
        profitMode: profitSummary.profitMode,
        avgMargin: profitSummary.avgMargin,
        mappedServices: profitSummary.mappedTiers,
        totalServiceTiers: profitSummary.totalTiers,
      },
      recentOrders,
      pendingDeposits: recentDeposits,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'FORBIDDEN'
    return NextResponse.json(
      { ok: false, error: msg === 'UNAUTHORIZED' ? 'Giriş gerekli' : 'Yetkisiz' },
      { status: msg === 'UNAUTHORIZED' ? 401 : 403 }
    )
  }
}
