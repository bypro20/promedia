import type { NextRequest } from 'next/server'

/** Vercel / proxy arkasındaki gerçek istemci IP */
export function getClientIp(req: Request | NextRequest): string | null {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    const ip = forwarded.split(',')[0]?.trim()
    if (ip) return ip
  }
  const real = req.headers.get('x-real-ip')?.trim()
  if (real) return real
  return null
}

export function normalizeIp(ip: string) {
  return ip.trim().toLowerCase()
}

export function isValidIp(ip: string) {
  return /^(?:\d{1,3}\.){3}\d{1,3}$/.test(ip) || ip.includes(':')
}
