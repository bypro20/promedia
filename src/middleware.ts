import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { getClientIp } from '@/lib/client-ip'

const COOKIE = 'pm_session'

function secret() {
  return new TextEncoder().encode(process.env.AUTH_SECRET ?? 'promedia-dev-secret-change-in-production')
}

async function readSession(req: NextRequest) {
  const token = req.cookies.get(COOKIE)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret())
    return { role: String(payload.role ?? 'user'), id: String(payload.id ?? '') }
  } catch {
    return null
  }
}

async function checkIpBanned(req: NextRequest) {
  const ip = getClientIp(req)
  if (!ip) return false
  try {
    const url = new URL('/api/security/check', req.url)
    url.searchParams.set('ip', ip)
    const res = await fetch(url.toString(), { cache: 'no-store' })
    if (!res.ok) return false
    const data = await res.json() as { banned?: boolean }
    return Boolean(data.banned)
  } catch {
    return false
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname !== '/engellendi' && !pathname.startsWith('/api/security/check')) {
    if (await checkIpBanned(req)) {
      const url = req.nextUrl.clone()
      url.pathname = '/engellendi'
      url.search = ''
      return NextResponse.redirect(url)
    }
  }

  const session = await readSession(req)
  const role = session?.role ?? null

  if (pathname.startsWith('/admin') && pathname !== '/admin/giris') {
    if (role !== 'admin') {
      const url = req.nextUrl.clone()
      url.pathname = '/admin/giris'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
  }

  if (pathname === '/admin/giris' && role === 'admin') {
    const url = req.nextUrl.clone()
    url.pathname = '/admin'
    url.search = ''
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith('/panel')) {
    if (role === 'admin') {
      const url = req.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }
    if (!role) {
      const url = req.nextUrl.clone()
      url.pathname = '/giris'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
  }

  if ((pathname === '/giris' || pathname === '/kayit') && role === 'admin') {
    const url = req.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  if ((pathname === '/giris' || pathname === '/kayit') && role === 'user') {
    const url = req.nextUrl.clone()
    url.pathname = '/panel'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
