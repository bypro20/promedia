import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { countPendingDeposits } from '@/lib/deposits'
import { SUPPORT_TICKET_FILTER } from '@/lib/ticket-utils'
import { prisma } from '@/lib/db'
import { isSmmConfigured } from '@/lib/smm/providers'

export async function GET() {
  try {
    const admin = await requireAdmin()

    const [userCount, adminCount, orderCount, revenue, activeOrders, openSupport, recentOrders, adminUser] =
      await Promise.all([
        prisma.user.count({ where: { role: 'user' } }),
        prisma.user.count({ where: { role: 'admin' } }),
        prisma.order.count(),
        prisma.order.aggregate({ _sum: { price: true } }),
        prisma.order.count({ where: { status: { in: ['pending', 'processing', 'in_progress'] } } }),
        prisma.ticket.count({ where: { status: 'open', ...SUPPORT_TICKET_FILTER } }),
        prisma.order.findMany({
          orderBy: { createdAt: 'desc' },
          take: 8,
          include: { user: { select: { email: true } } },
        }),
        prisma.user.findUnique({ where: { id: admin.id }, select: { balance: true, email: true } }),
      ])

    let pendingDeposits = 0
    let recentDeposits: Awaited<ReturnType<typeof prisma.depositRequest.findMany>> = []
    try {
      ;[pendingDeposits, recentDeposits] = await Promise.all([
        countPendingDeposits(),
        prisma.depositRequest.findMany({
          where: { status: 'pending' },
          orderBy: { createdAt: 'asc' },
          take: 5,
          include: { user: { select: { email: true, balance: true } } },
        }),
      ])
    } catch (depErr) {
      console.error('[admin/stats] depositRequest query failed', depErr)
    }

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
      },
      recentOrders,
      pendingDeposits: recentDeposits,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'UNKNOWN'
    if (msg === 'UNAUTHORIZED') {
      return NextResponse.json({ ok: false, error: 'Giriş gerekli' }, { status: 401 })
    }
    if (msg === 'FORBIDDEN') {
      return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 403 })
    }
    console.error('[admin/stats]', e)
    const detail = e instanceof Error ? e.message : 'unknown'
    const hint =
      detail.includes('TURSO') || detail.includes('libsql') || detail.includes('SQLITE')
        ? 'Turso bağlantısı başarısız — Vercel’de DATABASE_URL (libsql://…) ve TURSO_AUTH_TOKEN kontrol edin.'
        : 'İstatistikler yüklenemedi. Veritabanı bağlantısını kontrol edin.'
    return NextResponse.json({ ok: false, error: hint, detail }, { status: 500 })
  }
}
