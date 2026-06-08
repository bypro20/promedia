import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireCustomerSession } from '@/lib/panel-auth'
import { createDepositRequest, listUserDeposits } from '@/lib/deposits'
import { getTransactions } from '@/lib/wallet'
import { prisma } from '@/lib/db'

const depositSchema = z.object({
  amount: z.number().min(10),
  method: z.enum(['havale', 'papara', 'eft']).default('havale'),
  reference: z.string().max(200).optional(),
})

export async function GET() {
  try {
    const user = await requireCustomerSession()
    const fresh = await prisma.user.findUniqueOrThrow({ where: { id: user.id } })
    const [transactions, deposits] = await Promise.all([
      getTransactions(user.id),
      listUserDeposits(user.id),
    ])
    return NextResponse.json({
      ok: true,
      balance: fresh.balance,
      transactions,
      deposits,
      pendingDeposit: deposits.find((d) => d.status === 'pending') ?? null,
    })
  } catch {
    return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 401 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireCustomerSession()
    const body = await req.json()
    const data = depositSchema.parse(body)

    const deposit = await createDepositRequest(user.id, data.amount, data.method, data.reference)

    return NextResponse.json({
      ok: true,
      deposit,
      message: `${data.amount} ₺ yükleme talebiniz alındı. Ödemeniz admin tarafından onaylandığında bakiyenize yansır.`,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: 'Geçersiz tutar (min. 10 ₺)' }, { status: 400 })
    }
    const message = err instanceof Error ? err.message : 'Talep oluşturulamadı'
    return NextResponse.json({ ok: false, error: message }, { status: 400 })
  }
}
