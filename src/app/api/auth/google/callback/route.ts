import { NextResponse } from 'next/server'
import { handleGoogleCallback } from '@/lib/google-auth'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect('/giris?error=google_denied')
  }

  try {
    const user = await handleGoogleCallback(code)
    let next = '/panel'
    if (state) {
      try {
        const parsed = JSON.parse(Buffer.from(state, 'base64url').toString()) as { next?: string }
        if (parsed.next) next = parsed.next
      } catch { /* ignore */ }
    }
    if (user.role === 'admin' && next.startsWith('/admin')) {
      return NextResponse.redirect(next)
    }
    return NextResponse.redirect(user.role === 'admin' ? '/admin' : next)
  } catch {
    return NextResponse.redirect('/giris?error=google_failed')
  }
}
