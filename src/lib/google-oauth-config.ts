/** prmdia.com Google OAuth — tek kaynak (Console redirect URI ile birebir eşleşmeli) */
export const GOOGLE_OAUTH_CALLBACK_PATH = '/api/auth/google/callback'

export const GOOGLE_OAUTH_PRODUCTION_ORIGIN = 'https://prmdia.com'

export const GOOGLE_OAUTH_LOCAL_ORIGIN = 'http://localhost:3000'

export function googleOAuthCallbackUrl(origin: string): string {
  return `${origin.replace(/\/$/, '')}${GOOGLE_OAUTH_CALLBACK_PATH}`
}

/** Google Cloud Console → Authorized redirect URIs */
export const GOOGLE_CONSOLE_REDIRECT_URIS = [
  `${GOOGLE_OAUTH_PRODUCTION_ORIGIN}${GOOGLE_OAUTH_CALLBACK_PATH}`,
  `${GOOGLE_OAUTH_LOCAL_ORIGIN}${GOOGLE_OAUTH_CALLBACK_PATH}`,
] as const

/** Google Cloud Console → Authorized JavaScript origins */
export const GOOGLE_CONSOLE_JS_ORIGINS = [
  GOOGLE_OAUTH_PRODUCTION_ORIGIN,
  GOOGLE_OAUTH_LOCAL_ORIGIN,
] as const
