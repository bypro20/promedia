import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

export async function POST() {
  const secret = process.env.SETUP_SECRET ?? 'promedia-setup-once'
  const header = (await import('next/headers')).headers
  const h = await header()
  if (h.get('x-setup-secret') !== secret) {
    return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
  }

  const email = process.env.ADMIN_EMAIL ?? 'bypro1988@gmail.com'
  const password = process.env.ADMIN_PASSWORD ?? 'ProMedia2026!'

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        role: 'admin',
        active: true,
        password: await hashPassword(password),
      },
    })
    return NextResponse.json({ ok: true, message: 'Admin rolü ve şifre güncellendi', email })
  }

  await prisma.user.create({
    data: {
      email,
      password: await hashPassword(password),
      name: 'Admin',
      role: 'admin',
      balance: 1000,
    },
  })

  return NextResponse.json({ ok: true, email, password, message: 'Admin oluşturuldu — şifreyi değiştirin' })
}
