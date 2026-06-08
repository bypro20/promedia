import { NextResponse } from 'next/server'
import { handleGoogleCallback } from '@/lib/google-auth'
import { absoluteUrl } from '@/lib/site-url'
import { getClientIp } from '@/lib/client-ip'
import { assertIpAllowed, recordLoginIp } from '@/lib/security'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  const ip = getClientIp(req)
  try {
    await assertIpAllowed(ip)
  } catch {
    return NextResponse.redirect(absoluteUrl('/engellendi', req))
  }

  if (error || !code) {
    const errCode = error === 'access_denied' ? 'google_denied' : error ? 'google_oauth' : 'google_denied'
    const qs = new URLSearchParams({ error: errCode })
    if (error && error !== 'access_denied') qs.set('detail', error)
    return NextResponse.redirect(absoluteUrl(`/giris?${qs}`, req))
  }

  try {
    const origin = new URL(req.url).origin
    const user = await handleGoogleCallback(code, origin)
    await recordLoginIp(user.id, ip)
    let next = '/panel'
    if (state) {
      try {
        const parsed = JSON.parse(Buffer.from(state, 'base64url').toString()) as { next?: string }
        if (parsed.next) next = parsed.next
      } catch { /* ignore */ }
    }
    if (user.role === 'admin') {
      return NextResponse.redirect(absoluteUrl('/admin', req))
    }
    return NextResponse.redirect(absoluteUrl(next.startsWith('/panel') ? next : '/panel', req))
  } catch (e) {
    if (e instanceof Error && e.message === 'USER_BANNED') {
      return NextResponse.redirect(absoluteUrl('/engellendi', req))
    }
    return NextResponse.redirect(absoluteUrl('/giris?error=google_failed', req))
  }
}
