import Link from 'next/link'

export default function AdminBalancePage() {
  return (
    <main className="p-6 lg:p-8">
      <h1 className="text-2xl font-black">Bakiye Yönetimi</h1>
      <p className="mt-2 text-sm text-[#666F94]">Kullanıcı bakiyesi eklemek için Kullanıcılar sayfasını kullanın.</p>
      <Link href="/admin/kullanicilar" className="mt-4 inline-block rounded-xl bg-[#7844E4] px-4 py-2 text-sm font-bold text-white">
        Kullanıcılar → Bakiye Ekle
      </Link>
    </main>
  )
}
