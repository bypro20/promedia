import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const COOKIE = 'pm_session'

function secret() {
  return new TextEncoder().encode(process.env.AUTH_SECRET ?? 'promedia-dev-secret-change-in-production')
}

async function readRole(req: NextRequest) {
  const token = req.cookies.get(COOKIE)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret())
    return String(payload.role ?? 'user')
  } catch {
    return null
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const role = await readRole(req)

  if (pathname.startsWith('/admin')) {
    if (role !== 'admin') {
      const url = req.nextUrl.clone()
      url.pathname = '/giris'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
  }

  if (pathname.startsWith('/panel')) {
    if (!role) {
      const url = req.nextUrl.clone()
      url.pathname = '/giris'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
  }

  if ((pathname === '/giris' || pathname === '/kayit') && role) {
    const url = req.nextUrl.clone()
    url.pathname = role === 'admin' ? '/admin' : '/panel'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/panel/:path*', '/giris', '/kayit'],
}
