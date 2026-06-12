import { NextResponse } from 'next/server'
import { isGoogleAuthConfigured } from '@/lib/google-auth'
import { googleOAuthCallbackUrl } from '@/lib/google-oauth-config'
import { getSiteOrigin } from '@/lib/site-url'

export async function GET(req: Request) {
  const origin = new URL(req.url).origin
  const redirectUri = googleOAuthCallbackUrl(origin)
  const clientId = process.env.GOOGLE_CLIENT_ID ?? ''
  return NextResponse.json({
    ok: true,
    google: isGoogleAuthConfigured(),
    redirectUri,
    clientIdHint: clientId ? `${clientId.slice(0, 12)}…${clientId.slice(-20)}` : null,
  })
}
