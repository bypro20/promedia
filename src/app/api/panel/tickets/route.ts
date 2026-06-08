import { NextResponse } from 'next/server'
import { requireCustomerSession } from '@/lib/panel-auth'
import { isLegacyDepositTicket, SUPPORT_TICKET_FILTER } from '@/lib/ticket-utils'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const user = await requireCustomerSession()
    const tickets = await prisma.ticket.findMany({
      where: { userId: user.id, ...SUPPORT_TICKET_FILTER },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ ok: true, tickets })
  } catch {
    return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 401 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireCustomerSession()
    const { subject, body } = await req.json() as { subject: string; body: string }

    if (!subject?.trim() || !body?.trim()) {
      return NextResponse.json({ ok: false, error: 'Konu ve mesaj gerekli' }, { status: 400 })
    }
    if (isLegacyDepositTicket(subject) || /bakiye\s*yükle/i.test(subject)) {
      return NextResponse.json(
        { ok: false, error: 'Bakiye yükleme için Panel → Bakiye Yükle sayfasını kullanın' },
        { status: 400 }
      )
    }

    const ticket = await prisma.ticket.create({
      data: {
        userId: user.id,
        subject,
        messages: { create: { body, authorId: user.id, isStaff: false } },
      },
    })
    return NextResponse.json({ ok: true, ticket })
  } catch {
    return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 401 })
  }
}
