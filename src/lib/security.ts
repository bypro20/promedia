import { prisma } from '@/lib/db'
import { isValidIp, normalizeIp } from '@/lib/client-ip'

export async function logSecurity(action: string, opts: { target?: string; detail?: string; ip?: string; adminId?: string }) {
  await prisma.securityLog.create({
    data: {
      action,
      target: opts.target,
      detail: opts.detail,
      ip: opts.ip,
      adminId: opts.adminId,
    },
  })
}

export async function isIpBanned(ip: string | null) {
  if (!ip || !isValidIp(ip)) return false
  const ban = await prisma.ipBan.findFirst({
    where: { ip: normalizeIp(ip), active: true },
  })
  return Boolean(ban)
}

export async function banIp(ip: string, reason: string, adminId: string, userId?: string) {
  const normalized = normalizeIp(ip)
  if (!isValidIp(normalized)) throw new Error('Geçersiz IP adresi')

  await prisma.ipBan.upsert({
    where: { ip: normalized },
    create: { ip: normalized, reason, bannedBy: adminId, userId, active: true },
    update: { reason, bannedBy: adminId, userId, active: true },
  })

  await logSecurity('ip_ban', { target: normalized, detail: reason, ip: normalized, adminId })
}

export async function unbanIp(ip: string, adminId: string) {
  const normalized = normalizeIp(ip)
  await prisma.ipBan.updateMany({
    where: { ip: normalized },
    data: { active: false },
  })
  await logSecurity('ip_unban', { target: normalized, adminId })
}

export async function banUser(userId: string, reason: string, adminId: string, banIpToo = true) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } })
  if (user.role === 'admin') throw new Error('Admin hesabı engellenemez')

  await prisma.user.update({
    where: { id: userId },
    data: { active: false, banReason: reason, bannedAt: new Date() },
  })

  if (banIpToo && user.lastLoginIp) {
    await banIp(user.lastLoginIp, `Kullanıcı engeli: ${reason}`, adminId, userId)
  }

  await logSecurity('user_ban', { target: user.email, detail: reason, adminId })
}

export async function unbanUser(userId: string, adminId: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } })

  await prisma.user.update({
    where: { id: userId },
    data: { active: true, banReason: null, bannedAt: null },
  })

  if (user.lastLoginIp) {
    await prisma.ipBan.updateMany({
      where: { ip: normalizeIp(user.lastLoginIp), userId },
      data: { active: false },
    })
  }

  await logSecurity('user_unban', { target: user.email, adminId })
}

export async function deleteUser(userId: string, adminId: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } })
  if (user.role === 'admin') throw new Error('Admin hesabı silinemez')

  const adminCount = await prisma.user.count({ where: { role: 'admin' } })
  if (user.role === 'admin' && adminCount <= 1) throw new Error('Son admin silinemez')

  if (user.lastLoginIp) {
    await banIp(user.lastLoginIp, 'Hesap silindi', adminId, userId)
  }

  await logSecurity('user_delete', { target: user.email, adminId })
  await prisma.user.delete({ where: { id: userId } })
}

export async function recordLoginIp(userId: string, ip: string | null) {
  if (!ip || !isValidIp(ip)) return
  await prisma.user.update({
    where: { id: userId },
    data: { lastLoginIp: normalizeIp(ip) },
  })
}

export async function assertIpAllowed(ip: string | null) {
  if (await isIpBanned(ip)) {
    throw new Error('IP_BANNED')
  }
}

export async function assertUserAllowed(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || !user.active) {
    throw new Error('USER_BANNED')
  }
}
