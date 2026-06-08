import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/auth'
import { getTransactions } from '@/lib/wallet'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const user = await requireSession()
    const fresh = await prisma.user.findUniqueOrThrow({ where: { id: user.id } })
    const transactions = await getTransactions(user.id)
    return NextResponse.json({ ok: true, balance: fresh.balance, transactions })
  } catch {
    return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 401 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireSession()
    const { amount } = await req.json() as { amount: number }
    if (!amount || amount < 10) {
      return NextResponse.json({ ok: false, error: 'Minimum 10 ₺' }, { status: 400 })
    }

    await prisma.ticket.create({
      data: {
        userId: user.id,
        subject: `Bakiye yükleme talebi: ${amount} ₺`,
        status: 'open',
        messages: {
          create: { body: `${amount} ₺ bakiye yükleme talebi. Havale/Papara ile ödeme yapılacak.`, isStaff: false },
        },
      },
    })

    return NextResponse.json({
      ok: true,
      message: `${amount} ₺ yükleme talebiniz alındı. Admin onayından sonra bakiyenize eklenecek.`,
    })
  } catch {
    return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 401 })
  }
}
