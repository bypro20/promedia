import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PATCH(req: Request) {
  try {
    const user = await requireSession()
    const { name } = await req.json() as { name?: string }
    await prisma.user.update({ where: { id: user.id }, data: { name: name ?? null } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 401 })
  }
}
