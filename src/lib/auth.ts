import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

const COOKIE = 'pm_session'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 gün

export type SessionUser = {
  id: string
  email: string
  name: string | null
  role: string
  balance: number
}

function secret() {
  const s = process.env.AUTH_SECRET ?? 'promedia-dev-secret-change-in-production'
  return new TextEncoder().encode(s)
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    balance: user.balance,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret())

  const jar = await cookies()
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  })
}

export async function destroySession() {
  const jar = await cookies()
  jar.delete(COOKIE)
}

export async function getSession(): Promise<SessionUser | null> {
  const jar = await cookies()
  const token = jar.get(COOKIE)?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, secret())
    const user = await prisma.user.findUnique({
      where: { id: String(payload.id) },
      select: { id: true, email: true, name: true, role: true, balance: true, active: true },
    })
    if (!user || !user.active) return null
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      balance: user.balance,
    }
  } catch {
    return null
  }
}

export async function requireSession(): Promise<SessionUser> {
  const s = await getSession()
  if (!s) throw new Error('UNAUTHORIZED')
  return s
}

export async function requireAdmin(): Promise<SessionUser> {
  const s = await requireSession()
  if (s.role !== 'admin') throw new Error('FORBIDDEN')
  return s
}

export function toSessionUser(user: {
  id: string
  email: string
  name: string | null
  role: string
  balance: number
}): SessionUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    balance: user.balance,
  }
}
