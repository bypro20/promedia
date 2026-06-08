import { NextResponse } from 'next/server'
import { getGoogleAuthUrl, isGoogleAuthConfigured } from '@/lib/google-auth'
import { absoluteUrl } from '@/lib/site-url'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const next = searchParams.get('next') ?? '/panel'

  if (!isGoogleAuthConfigured()) {
    return NextResponse.redirect(absoluteUrl('/giris?error=google_not_configured', req))
  }

  try {
    const origin = new URL(req.url).origin
    const state = Buffer.from(JSON.stringify({ next })).toString('base64url')
    const url = getGoogleAuthUrl(state, origin)
    return NextResponse.redirect(url)
  } catch {
    return NextResponse.redirect(absoluteUrl('/giris?error=google_failed', req))
  }
}
