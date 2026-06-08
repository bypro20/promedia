import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { SUPPORT_TICKET_FILTER } from '@/lib/ticket-utils'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    await requireAdmin()
    const tickets = await prisma.ticket.findMany({
      where: SUPPORT_TICKET_FILTER,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { email: true, name: true } },
        messages: { orderBy: { createdAt: 'asc' }, take: 1 },
        _count: { select: { messages: true } },
      },
    })
    return NextResponse.json({ ok: true, tickets })
  } catch {
    return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 403 })
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin()
    const { ticketId, status } = await req.json() as { ticketId: string; status: string }
    await prisma.ticket.update({ where: { id: ticketId }, data: { status } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 403 })
  }
}
