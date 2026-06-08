import { prisma } from '@/lib/db'
import { requireSession } from '@/lib/auth'

/** Panel API'lerinde kaynağın oturum sahibine ait olduğunu doğrula */
export async function requireOwnResource(ownerUserId: string | null | undefined, sessionUserId: string) {
  if (!ownerUserId || ownerUserId !== sessionUserId) {
    throw new Error('FORBIDDEN')
  }
}

/** Müşteri paneli oturumu — admin erişemez, banlı kullanıcı erişemez */
export async function requireCustomerSession() {
  const user = await requireSession()
  if (user.role === 'admin') throw new Error('FORBIDDEN')
  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { active: true } })
  if (!dbUser?.active) throw new Error('USER_BANNED')
  return user
}
