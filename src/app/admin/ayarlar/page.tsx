export default function AdminSettingsPage() {
  return (
    <main className="p-6 lg:p-8">
      <h1 className="text-2xl font-black">Site Ayarları</h1>
      <div className="mt-6 max-w-lg space-y-4 rounded-2xl bg-white p-5 shadow-sm text-sm">
        <p><strong>Site URL:</strong> {process.env.NEXT_PUBLIC_SITE_URL ?? 'https://promedia-kappa.vercel.app'}</p>
        <p><strong>Google OAuth:</strong> {process.env.GOOGLE_CLIENT_ID ? 'Yapılandırıldı ✓' : 'GOOGLE_CLIENT_ID gerekli'}</p>
        <p><strong>SMM:</strong> Ortam değişkenlerinden yönetilir → <a href="/admin/smm" className="text-[#7844E4] font-bold">SMM Paneller</a></p>
      </div>
    </main>
  )
}
