import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    await requireAdmin()
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { email: true } } },
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
