#!/usr/bin/env node
/**
 * prmdia.com Google OAuth durumunu kontrol eder.
 */
const GOOGLE_OAUTH_CALLBACK_PATH = '/api/auth/google/callback'
const GOOGLE_OAUTH_PRODUCTION_ORIGIN = 'https://prmdia.com'
const GOOGLE_CONSOLE_REDIRECT_URIS = [
  `${GOOGLE_OAUTH_PRODUCTION_ORIGIN}${GOOGLE_OAUTH_CALLBACK_PATH}`,
  `http://localhost:3000${GOOGLE_OAUTH_CALLBACK_PATH}`,
]
const GOOGLE_CONSOLE_JS_ORIGINS = [
  GOOGLE_OAUTH_PRODUCTION_ORIGIN,
  'http://localhost:3000',
]

const SITE = process.env.SITE_URL || GOOGLE_OAUTH_PRODUCTION_ORIGIN

async function main() {
  console.log(`\nProMedia Google OAuth — ${SITE}\n`)

  const localId = process.env.GOOGLE_CLIENT_ID
  const localSecret = process.env.GOOGLE_CLIENT_SECRET
  console.log('Yerel .env:')
  console.log(`  GOOGLE_CLIENT_ID:     ${localId ? `${localId.slice(0, 20)}…` : '✗ eksik'}`)
  console.log(`  GOOGLE_CLIENT_SECRET: ${localSecret ? '✓ tanımlı' : '✗ eksik'}`)

  let cfg
  try {
    const res = await fetch(`${SITE}/api/auth/config`)
    cfg = await res.json()
  } catch (e) {
    console.error('\nCanlı site okunamadı:', e.message)
    process.exit(1)
  }

  console.log('\nCanlı site (/api/auth/config):')
  console.log(`  google:       ${cfg.google ? '✓ key var' : '✗ key yok'}`)
  console.log(`  redirectUri:  ${cfg.redirectUri}`)
  console.log(`  clientIdHint: ${cfg.clientIdHint ?? '—'}`)

  console.log('\nGoogle Cloud Console → Credentials → OAuth 2.0 Client')
  console.log('Authorized JavaScript origins:')
  for (const o of GOOGLE_CONSOLE_JS_ORIGINS) console.log(`  ${o}`)
  console.log('\nAuthorized redirect URIs (birebir, sonda / yok):')
  for (const u of GOOGLE_CONSOLE_REDIRECT_URIS) console.log(`  ${u}`)

  try {
    const res = await fetch(`${SITE}/api/auth/google?next=/panel`, { redirect: 'manual' })
    const loc = res.headers.get('location') ?? ''
    const match = loc.match(/redirect_uri=([^&]+)/)
    if (match) {
      const sent = decodeURIComponent(match[1])
      console.log('\nGoogle\'a gönderilen redirect_uri:')
      console.log(`  ${sent}`)
      if (GOOGLE_CONSOLE_REDIRECT_URIS.includes(sent)) {
        console.log('\n→ Kod doğru URI gönderiyor. Hata = Google Console\'da bu URI kayıtlı değil.')
        console.log('  https://console.cloud.google.com/apis/credentials adresinden ekleyin.\n')
      }
    }
  } catch { /* */ }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
