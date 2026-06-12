import Link from 'next/link'
import { isGoogleAuthConfigured } from '@/lib/google-auth'
import {
  GOOGLE_CONSOLE_JS_ORIGINS,
  GOOGLE_CONSOLE_REDIRECT_URIS,
} from '@/lib/google-oauth-config'
import { getSiteOrigin } from '@/lib/site-url'

export default function AdminSettingsPage() {
  const siteUrl = getSiteOrigin()
  const googleOk = isGoogleAuthConfigured()
  const clientId = process.env.GOOGLE_CLIENT_ID ?? ''

  return (
    <main className="p-6 lg:p-8">
      <h1 className="text-2xl font-black">Site Ayarları</h1>

      <div className="mt-6 max-w-2xl space-y-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm text-sm">
          <p><strong>Site URL:</strong> {siteUrl}</p>
          <p className="mt-2">
            <strong>Google OAuth:</strong>{' '}
            {googleOk ? (
              <span className="text-green-600 font-semibold">Key tanımlı ✓</span>
            ) : (
              <span className="text-red-600">GOOGLE_CLIENT_ID + SECRET gerekli (Vercel env)</span>
            )}
          </p>
          {googleOk && (
            <div className="mt-4 rounded-xl bg-[#F0F1F9] p-4 space-y-3">
              <p className="font-bold text-[#33353E]">Google Console kurulumu</p>
              <ol className="list-decimal space-y-2 pl-5 text-xs text-[#666F94]">
                <li>
                  <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="font-bold text-[#7844E4] hover:underline">
                    Google Cloud Console → Credentials
                  </a>
                  {' '}açın
                </li>
                <li>
                  Client ID ile eşleşen OAuth client&apos;ı seçin:
                  <code className="mt-1 block break-all rounded-lg bg-white px-2 py-1">{clientId}</code>
                </li>
                <li>
                  <strong className="text-[#33353E]">Authorized redirect URIs</strong> bölümüne şunları ekleyin:
                  {GOOGLE_CONSOLE_REDIRECT_URIS.map((uri) => (
                    <code key={uri} className="mt-1 block break-all rounded-lg bg-white px-2 py-1">{uri}</code>
                  ))}
                </li>
                <li>
                  <strong className="text-[#33353E]">Authorized JavaScript origins</strong> (path yok, sonda / yok):
                  {GOOGLE_CONSOLE_JS_ORIGINS.map((uri) => (
                    <code key={uri} className="mt-1 block break-all rounded-lg bg-white px-2 py-1">{uri}</code>
                  ))}
                </li>
                <li>Kaydedin, 1–2 dk bekleyin, /giris sayfasından tekrar deneyin.</li>
              </ol>
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm text-sm">
          <p><strong>SMM paneller:</strong> API key&apos;leri panelden yönetin</p>
          <Link href="/admin/smm" className="mt-2 inline-block font-bold text-[#7844E4] hover:underline">
            SMM Paneller →
          </Link>
        </div>
      </div>
    </main>
  )
}
