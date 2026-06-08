import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { SUPPORT_TICKET_FILTER } from '@/lib/ticket-utils'
import { prisma } from '@/lib/db'

type Props = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Props) {
  try {
    await requireAdmin()
    const { id } = await params
    const ticket = await prisma.ticket.findFirst({
      where: { id, ...SUPPORT_TICKET_FILTER },
      include: {
        user: { select: { email: true, name: true } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    })
    if (!ticket) {
      return NextResponse.json({ ok: false, error: 'Talep bulunamadı' }, { status: 404 })
    }
    return NextResponse.json({ ok: true, ticket, messages: ticket.messages })
  } catch {
    return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 403 })
  }
}

export async function POST(req: Request, { params }: Props) {
  try {
    const admin = await requireAdmin()
    const { id } = await params
    const { body } = await req.json() as { body: string }

    const ticket = await prisma.ticket.findFirst({
      where: { id, ...SUPPORT_TICKET_FILTER },
    })
    if (!ticket) {
      return NextResponse.json({ ok: false, error: 'Talep bulunamadı' }, { status: 404 })
    }
    if (!body?.trim()) {
      return NextResponse.json({ ok: false, error: 'Mesaj gerekli' }, { status: 400 })
    }

    const msg = await prisma.ticketMessage.create({
      data: { ticketId: ticket.id, body: body.trim(), authorId: admin.id, isStaff: true },
    })
    await prisma.ticket.update({
      where: { id: ticket.id },
      data: { status: 'open', updatedAt: new Date() },
    })
    return NextResponse.json({ ok: true, message: msg })
  } catch {
    return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 403 })
  }
}

export async function PATCH(req: Request, { params }: Props) {
  try {
    await requireAdmin()
    const { id } = await params
    const { status } = await req.json() as { status: string }
    await prisma.ticket.update({ where: { id }, data: { status } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 403 })
  }
}
