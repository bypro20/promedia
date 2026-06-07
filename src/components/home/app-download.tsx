export function AppDownload() {
  return (
    <section className="bg-[#7844E4] py-14 text-white">
      <div className="sd-container grid items-center gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold">ProMedia uygulaması yayında!</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/80">
            Tüm sosyal medya hizmetlerimize tek yerden hızlıca ulaşabilir, paketleri karşılaştırıp saniyeler içinde sipariş verebilirsiniz.
            Uygulama üzerinden anlık sipariş takibi yapabilir, özel indirim ve kampanyalardan ilk siz haberdar olabilirsiniz.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#" className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#7844E4] hover:bg-white/90">
              App Store&apos;dan İndirin
            </a>
            <a href="#" className="rounded-xl border-2 border-white/40 px-5 py-3 text-sm font-semibold hover:bg-white/10">
              Google Play&apos;den İndirin
            </a>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="h-64 w-40 rounded-3xl bg-white/10 p-2">
            <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-white/20">
              <span className="text-4xl font-bold">PM</span>
              <span className="mt-2 text-xs text-white/70">Mobil Uygulama</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
