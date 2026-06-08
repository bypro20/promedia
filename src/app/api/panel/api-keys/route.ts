import { NextResponse } from 'next/server'
import { requireCustomerSession } from '@/lib/panel-auth'
import { prisma } from '@/lib/db'
import { randomBytes } from 'crypto'

export async function GET() {
  try {
    const user = await requireCustomerSession()
    const keys = await prisma.userApiKey.findMany({ where: { userId: user.id, active: true }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ ok: true, keys })
  } catch {
    return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 401 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireCustomerSession()
    const { label } = await req.json() as { label?: string }
    const key = `pm_${randomBytes(24).toString('hex')}`
    const created = await prisma.userApiKey.create({
      data: { userId: user.id, key, label: label ?? 'API Key' },
    })
    return NextResponse.json({ ok: true, key: created })
  } catch {
    return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 401 })
  }
}
