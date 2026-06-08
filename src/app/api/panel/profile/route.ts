import { NextResponse } from 'next/server'
import { requireCustomerSession } from '@/lib/panel-auth'
import { hashPassword, verifyPassword } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const user = await requireCustomerSession()
    const fresh = await prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      select: { name: true, email: true, balance: true, password: true },
    })
    return NextResponse.json({
      ok: true,
      user: {
        name: fresh.name,
        email: fresh.email,
        balance: fresh.balance,
        hasPassword: Boolean(fresh.password),
      },
    })
  } catch {
    return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 401 })
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await requireCustomerSession()
    const body = await req.json() as { name?: string; currentPassword?: string; newPassword?: string }

    if (body.newPassword) {
      const fresh = await prisma.user.findUniqueOrThrow({ where: { id: user.id } })
      if (!fresh.password) {
        return NextResponse.json({ ok: false, error: 'Google hesabı — şifre ayarlanamaz' }, { status: 400 })
      }
      if (!body.currentPassword || !(await verifyPassword(body.currentPassword, fresh.password))) {
        return NextResponse.json({ ok: false, error: 'Mevcut şifre hatalı' }, { status: 400 })
      }
      if (body.newPassword.length < 6) {
        return NextResponse.json({ ok: false, error: 'Yeni şifre en az 6 karakter' }, { status: 400 })
      }
      await prisma.user.update({
        where: { id: user.id },
        data: { password: await hashPassword(body.newPassword) },
      })
      return NextResponse.json({ ok: true })
    }

    if (body.name !== undefined) {
      await prisma.user.update({ where: { id: user.id }, data: { name: body.name ?? null } })
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 401 })
  }
}
