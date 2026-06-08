import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { setBalance } from '@/lib/wallet'
import { banIp, banUser, deleteUser, unbanUser } from '@/lib/security'
import { isValidIp, normalizeIp } from '@/lib/client-ip'

export async function GET() {
  try {
    await requireAdmin()
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        balance: true,
        active: true,
        lastLoginIp: true,
        banReason: true,
        bannedAt: true,
        createdAt: true,
        googleId: true,
      },
    })
    return NextResponse.json({ ok: true, users })
  } catch {
    return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 403 })
  }
}

const patchSchema = z.object({
  userId: z.string(),
  role: z.enum(['user', 'admin']).optional(),
  active: z.boolean().optional(),
  setBalance: z.number().min(0).optional(),
  note: z.string().optional(),
})

export async function PATCH(req: Request) {
  try {
    const admin = await requireAdmin()
    const body = patchSchema.parse(await req.json())

    if (body.setBalance !== undefined) {
      await setBalance(body.userId, body.setBalance, body.note ?? `Admin bakiye ayarı → ${body.setBalance.toFixed(2)} ₺`)
    }

    if (body.role !== undefined) {
      if (body.role === 'admin') {
        await prisma.user.update({ where: { id: body.userId }, data: { role: 'admin' } })
      } else {
        const target = await prisma.user.findUnique({ where: { id: body.userId } })
        if (target?.role === 'admin') {
          const adminCount = await prisma.user.count({ where: { role: 'admin', active: true } })
          if (adminCount <= 1) throw new Error('Son aktif admin kaldırılamaz')
        }
        await prisma.user.update({ where: { id: body.userId }, data: { role: 'user' } })
      }
    }

    if (body.active === true) {
      await unbanUser(body.userId, admin.id)
    } else if (body.active === false) {
      await banUser(body.userId, body.note ?? 'Admin tarafından engellendi', admin.id, false)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: 'Geçersiz istek' }, { status: 400 })
    }
    const msg = err instanceof Error ? err.message : 'Hata'
    return NextResponse.json({ ok: false, error: msg }, { status: 403 })
  }
}

const actionSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('ban'),
    userId: z.string(),
    reason: z.string().optional(),
    banIp: z.boolean().default(true),
  }),
  z.object({ action: z.literal('unban'), userId: z.string() }),
  z.object({
    action: z.literal('ban_ip'),
    userId: z.string(),
    ip: z.string().optional(),
    reason: z.string().optional(),
  }),
  z.object({ action: z.literal('delete'), userId: z.string() }),
])

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin()
    const body = actionSchema.parse(await req.json())

    if (body.action === 'ban') {
      await banUser(body.userId, body.reason ?? 'Kural ihlali', admin.id, body.banIp)
      return NextResponse.json({ ok: true, message: 'Kullanıcı engellendi' })
    }

    if (body.action === 'unban') {
      await unbanUser(body.userId, admin.id)
      return NextResponse.json({ ok: true, message: 'Engel kaldırıldı' })
    }

    if (body.action === 'ban_ip') {
      const user = await prisma.user.findUniqueOrThrow({ where: { id: body.userId } })
      const ip = body.ip ? normalizeIp(body.ip) : user.lastLoginIp
      if (!ip || !isValidIp(ip)) {
        return NextResponse.json({ ok: false, error: 'Geçerli IP bulunamadı' }, { status: 400 })
      }
      await banIp(ip, body.reason ?? `Ban: ${user.email}`, admin.id, user.id)
      await banUser(body.userId, body.reason ?? 'IP ban', admin.id, false)
      return NextResponse.json({ ok: true, message: `${ip} ve kullanıcı engellendi` })
    }

    if (body.userId === admin.id) {
      return NextResponse.json({ ok: false, error: 'Kendi hesabınızı silemezsiniz' }, { status: 400 })
    }
    await deleteUser(body.userId, admin.id)
    return NextResponse.json({ ok: true, message: 'Kullanıcı silindi' })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: 'Geçersiz istek' }, { status: 400 })
    }
    const msg = err instanceof Error ? err.message : 'Hata'
    return NextResponse.json({ ok: false, error: msg }, { status: 400 })
  }
}
