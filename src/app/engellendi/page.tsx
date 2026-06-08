export default function BlockedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#1a1d2e] px-4">
      <div className="max-w-md rounded-2xl border border-red-500/30 bg-[#282D40] p-8 text-center text-white">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-3xl">
          ⛔
        </div>
        <h1 className="mt-4 text-xl font-black">Erişim Engellendi</h1>
        <p className="mt-2 text-sm text-white/60">
          IP adresiniz veya hesabınız site yönetimi tarafından engellenmiştir. Bu siteye tekrar erişemezsiniz.
        </p>
        <p className="mt-4 text-xs text-white/40">
          Hatalı olduğunu düşünüyorsanız destek ile iletişime geçin.
        </p>
      </div>
    </main>
  )
}
