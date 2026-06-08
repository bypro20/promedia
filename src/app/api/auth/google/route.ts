import { NextResponse } from 'next/server'
import { getGoogleAuthUrl } from '@/lib/google-auth'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const next = searchParams.get('next') ?? '/panel'
    const state = Buffer.from(JSON.stringify({ next })).toString('base64url')
    const url = getGoogleAuthUrl(state)
    return NextResponse.redirect(url)
  } catch {
    return NextResponse.redirect('/giris?error=google_not_configured')
  }
}
