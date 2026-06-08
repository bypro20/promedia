import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth'
import { banIp, logSecurity, unbanIp } from '@/lib/security'
import { prisma } from '@/lib/db'
import { isValidIp, normalizeIp } from '@/lib/client-ip'

export async function GET() {
  try {
    const admin = await requireAdmin()
    const [ipBans, logs] = await Promise.all([
      prisma.ipBan.findMany({
        where: { active: true },
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true } } },
      }),
      prisma.securityLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
    ])
    return NextResponse.json({ ok: true, ipBans, logs, adminId: admin.id })
  } catch {
    return NextResponse.json({ ok: false, error: 'Yetkisiz' }, { status: 403 })
  }
}

const actionSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('ban_ip'), ip: z.string(), reason: z.string().optional() }),
  z.object({ action: z.literal('unban_ip'), ip: z.string() }),
])

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin()
    const body = actionSchema.parse(await req.json())

    if (body.action === 'ban_ip') {
      const ip = normalizeIp(body.ip)
      if (!isValidIp(ip)) {
        return NextResponse.json({ ok: false, error: 'Geçersiz IP' }, { status: 400 })
      }
      await banIp(ip, body.reason ?? 'Admin IP ban', admin.id)
      return NextResponse.json({ ok: true, message: `${ip} engellendi` })
    }

    await unbanIp(body.ip, admin.id)
    return NextResponse.json({ ok: true, message: 'IP engeli kaldırıldı' })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: 'Geçersiz istek' }, { status: 400 })
    }
    const message = err instanceof Error ? err.message : 'İşlem başarısız'
    return NextResponse.json({ ok: false, error: message }, { status: 400 })
  }
}
