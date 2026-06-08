import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const user = await requireSession()
    const tickets = await prisma.ticket.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ ok: true, tickets })
  } catch {
    return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 401 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireSession()
    const { subject, body } = await req.json() as { subject: string; body: string }
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
