import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth'
import {
  approveDeposit,
  countPendingDeposits,
  listAllDeposits,
  listPendingDeposits,
  rejectDeposit,
} from '@/lib/deposits'
import { creditBalance, setBalance } from '@/lib/wallet'
import { prisma } from '@/lib/db'

export async function GET(req: Request) {
  try {
    await requireAdmin()
    const { searchParams } = new URL(req.url)
    const pendingOnly = searchParams.get('pending') === '1'

    const [deposits, pendingCount, recentTransactions] = await Promise.all([
      pendingOnly ? listPendingDeposits() : listAllDeposits(),
      countPendingDeposits(),
      prisma.transaction.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
        include: { user: { select: { email: true } } },
      }),
    ])

    return NextResponse.json({ ok: true, deposits, pendingCount, recentTransactions })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'FORBIDDEN'
    return NextResponse.json(
      { ok: false, error: msg === 'UNAUTHORIZED' ? 'Giriş gerekli' : 'Yetkisiz' },
      { status: msg === 'UNAUTHORIZED' ? 401 : 403 }
    )
  }
}

const actionSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('approve'), depositId: z.string(), adminNote: z.string().optional() }),
  z.object({ action: z.literal('reject'), depositId: z.string(), adminNote: z.string().optional() }),
  z.object({
    action: z.literal('set_balance'),
    userId: z.string(),
    amount: z.number().min(0),
    note: z.string().optional(),
  }),
])

export async function PATCH(req: Request) {
  try {
    await requireAdmin()
    const body = actionSchema.parse(await req.json())

    if (body.action === 'approve') {
      const balance = await approveDeposit(body.depositId, body.adminNote)
      return NextResponse.json({ ok: true, balance, message: 'Bakiye onaylandı ve yüklendi' })
    }

    if (body.action === 'reject') {
      await rejectDeposit(body.depositId, body.adminNote)
      return NextResponse.json({ ok: true, message: 'Talep reddedildi' })
    }

    const balance = await setBalance(
      body.userId,
      body.amount,
      body.note?.trim() || `Admin bakiye ayarı → ${body.amount.toFixed(2)} ₺`
    )
    return NextResponse.json({ ok: true, balance, message: `Bakiye ${body.amount.toFixed(2)} ₺ olarak ayarlandı` })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: 'Geçersiz istek' }, { status: 400 })
    }
    const message = err instanceof Error ? err.message : 'İşlem başarısız'
    return NextResponse.json({ ok: false, error: message }, { status: 400 })
  }
}
