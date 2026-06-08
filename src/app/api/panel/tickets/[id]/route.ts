import { NextResponse } from 'next/server'
import { requireCustomerSession } from '@/lib/panel-auth'
import { isLegacyDepositTicket, SUPPORT_TICKET_FILTER } from '@/lib/ticket-utils'
import { prisma } from '@/lib/db'

type Props = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Props) {
  try {
    const user = await requireCustomerSession()
    const { id } = await params
    const ticket = await prisma.ticket.findFirst({
      where: { id, userId: user.id, ...SUPPORT_TICKET_FILTER },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    })
    if (!ticket) {
      return NextResponse.json({ ok: false, error: 'Talep bulunamadı' }, { status: 404 })
    }
    return NextResponse.json({ ok: true, ticket, messages: ticket.messages })
  } catch {
    return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 401 })
  }
}

export async function POST(req: Request, { params }: Props) {
  try {
    const user = await requireCustomerSession()
    const { id } = await params
    const { body } = await req.json() as { body: string }

    const ticket = await prisma.ticket.findFirst({
      where: { id, userId: user.id, status: 'open', ...SUPPORT_TICKET_FILTER },
    })
    if (!ticket) {
      return NextResponse.json({ ok: false, error: 'Talep bulunamadı veya kapalı' }, { status: 404 })
    }
    if (!body?.trim()) {
      return NextResponse.json({ ok: false, error: 'Mesaj gerekli' }, { status: 400 })
    }

    const msg = await prisma.ticketMessage.create({
      data: { ticketId: ticket.id, body: body.trim(), authorId: user.id, isStaff: false },
    })
    await prisma.ticket.update({ where: { id: ticket.id }, data: { updatedAt: new Date() } })
    return NextResponse.json({ ok: true, message: msg })
  } catch {
    return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 401 })
  }
}
