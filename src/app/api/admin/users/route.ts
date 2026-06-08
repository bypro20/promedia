import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { creditBalance } from '@/lib/wallet'

export async function GET() {
  try {
    await requireAdmin()
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, name: true, role: true, balance: true, active: true, createdAt: true, googleId: true },
    })
    return NextResponse.json({ ok: true, users })
  } catch {
    return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 403 })
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin()
    const { userId, role, active, addBalance, note } = await req.json() as {
      userId: string; role?: string; active?: boolean; addBalance?: number; note?: string
    }

    if (addBalance && addBalance > 0) {
      await creditBalance(userId, addBalance, note ?? 'Admin bakiye yükleme')
    }

    if (role !== undefined || active !== undefined) {
      await prisma.user.update({
        where: { id: userId },
        data: { ...(role !== undefined && { role }), ...(active !== undefined && { active }) },
      })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Hata'
    return NextResponse.json({ ok: false, error: msg }, { status: 403 })
  }
}
