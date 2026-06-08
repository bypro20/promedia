import { prisma } from '@/lib/db'
import { createSession, toSessionUser } from '@/lib/auth'

const GOOGLE_AUTH = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN = 'https://oauth2.googleapis.com/token'
const GOOGLE_USER = 'https://www.googleapis.com/oauth2/v2/userinfo'

function googleConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  if (!clientId || !clientSecret) return null
  return { clientId, clientSecret, redirectUri: `${baseUrl}/api/auth/google/callback` }
}

export function getGoogleAuthUrl(state: string) {
  const cfg = googleConfig()
  if (!cfg) throw new Error('Google OAuth yapılandırılmadı')

  const params = new URLSearchParams({
    client_id: cfg.clientId,
    redirect_uri: cfg.redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
  })
  return `${GOOGLE_AUTH}?${params}`
}

export async function handleGoogleCallback(code: string) {
  const cfg = googleConfig()
  if (!cfg) throw new Error('Google OAuth yapılandırılmadı')

  const tokenRes = await fetch(GOOGLE_TOKEN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
      redirect_uri: cfg.redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  const tokenData = await tokenRes.json()
  if (!tokenData.access_token) throw new Error('Google token alınamadı')

  const userRes = await fetch(GOOGLE_USER, {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  })
  const profile = await userRes.json() as {
    id: string
    email: string
    name?: string
    picture?: string
  }

  if (!profile.email) throw new Error('Google e-posta alınamadı')

  let user = await prisma.user.findFirst({
    where: { OR: [{ googleId: profile.id }, { email: profile.email.toLowerCase() }] },
  })

  if (user) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        googleId: profile.id,
        name: user.name ?? profile.name ?? null,
        avatar: profile.picture ?? user.avatar,
      },
    })
  } else {
    user = await prisma.user.create({
      data: {
        email: profile.email.toLowerCase(),
        googleId: profile.id,
        name: profile.name ?? null,
        avatar: profile.picture ?? null,
        role: 'user',
      },
    })
  }

  const sessionUser = toSessionUser(user)
  await createSession(sessionUser)
  return sessionUser
}
