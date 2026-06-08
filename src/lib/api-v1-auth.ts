import { prisma } from '@/lib/db'

const buckets = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(key: string, limit = 60, windowMs = 60_000): boolean {
  const now = Date.now()
  const entry = buckets.get(key)
  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= limit) return false
  entry.count++
  return true
}

export async function authenticateApiKey(header: string | null) {
  if (!header?.startsWith('Bearer ')) return null
  const key = header.slice(7).trim()
  if (!key) return null

  const record = await prisma.userApiKey.findFirst({
    where: { key, active: true },
    include: { user: { select: { id: true, email: true, balance: true, active: true } } },
  })
  if (!record || !record.user.active) return null
  return record.user
}
