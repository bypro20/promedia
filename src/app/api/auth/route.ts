import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { createSession, getSession, hashPassword, toSessionUser, verifyPassword } from '@/lib/auth'
import { getClientIp } from '@/lib/client-ip'
import { assertIpAllowed, recordLoginIp } from '@/lib/security'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2).optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  portal: z.enum(['customer', 'admin']).optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const action = body.action as string

    if (action === 'register') {
      const data = registerSchema.parse(body)
      const ip = getClientIp(req)
      try {
        await assertIpAllowed(ip)
      } catch {
        return NextResponse.json({ ok: false, error: 'Erişiminiz engellenmiş' }, { status: 403 })
      }

      const exists = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } })
      if (exists) {
        return NextResponse.json({ ok: false, error: 'Bu e-posta zaten kayıtlı' }, { status: 400 })
      }

      const user = await prisma.user.create({
        data: {
          email: data.email.toLowerCase(),
          password: await hashPassword(data.password),
          name: data.name ?? null,
          role: 'user',
        },
      })

      const sessionUser = toSessionUser(user)
      await createSession(sessionUser)
      await recordLoginIp(user.id, ip)
      return NextResponse.json({ ok: true, user: sessionUser })
    }

    if (action === 'login') {
      const data = loginSchema.parse(body)
      const ip = getClientIp(req)
      try {
        await assertIpAllowed(ip)
      } catch {
        return NextResponse.json({ ok: false, error: 'Erişiminiz engellenmiş' }, { status: 403 })
      }

      const user = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } })
      if (!user || !user.active || !user.password) {
        return NextResponse.json(
          { ok: false, error: user && !user.active ? 'Hesabınız engellenmiş' : user?.googleId ? 'Google ile giriş yapın' : 'E-posta veya şifre hatalı' },
          { status: 401 }
        )
      }

      const valid = await verifyPassword(data.password, user.password)
      if (!valid) {
        return NextResponse.json({ ok: false, error: 'E-posta veya şifre hatalı' }, { status: 401 })
      }

      const portal = data.portal ?? 'customer'
      if (portal === 'admin' && user.role !== 'admin') {
        return NextResponse.json({ ok: false, error: 'Bu hesap yönetici yetkisine sahip değil' }, { status: 403 })
      }
      if (portal === 'customer' && user.role === 'admin') {
        return NextResponse.json(
          { ok: false, error: 'Yönetici hesabı müşteri panelinden giriş yapamaz — /admin/giris kullanın' },
          { status: 403 }
        )
      }

      const sessionUser = toSessionUser(user)
      await createSession(sessionUser)
      await recordLoginIp(user.id, ip)
      return NextResponse.json({ ok: true, user: sessionUser })
    }

    return NextResponse.json({ ok: false, error: 'Geçersiz işlem' }, { status: 400 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: 'Geçersiz bilgi' }, { status: 400 })
    }
    return NextResponse.json({ ok: false, error: 'İşlem başarısız — veritabanı bağlantısı kontrol edin' }, { status: 503 })
  }
}

export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ ok: false, user: null }, { status: 401 })
  return NextResponse.json({ ok: true, user })
}

export async function DELETE() {
  const { destroySession } = await import('@/lib/auth')
  await destroySession()
  return NextResponse.json({ ok: true })
}
