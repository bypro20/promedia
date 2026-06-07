const POSTS = [
  { title: 'Instagram\'da Otomatik Beğeni Sistemleri Nasıl Çalışır?', excerpt: 'Instagram otomatik beğeni sistemleri nasıl çalışır ve kimler yararlanabilir keşfedin.', date: '2026' },
  { title: 'Güvenilir Instagram Takipçi Nasıl Satın Alınır?', excerpt: 'Güvenilir takipçi satın alma rehberine göz atarak doğru platformu nasıl seçeceğinizi keşfedin.', date: '2026' },
  { title: 'TikTok Keşfet Algoritması 2026 Rehberi', excerpt: 'TikTok keşfet sayfasına düşmek için bilmeniz gereken tüm stratejiler.', date: '2026' },
]

export function BlogPreview() {
  return (
    <section className="py-14">
      <div className="sd-container">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#33353E]">Son Bloglarımız</h2>
          <p className="mt-1 text-sm text-[#666F94]">En güncel içeriklere göz atın ve sosyal medya dünyasındaki trendleri takip edin</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {POSTS.map((post) => (
            <article key={post.title} className="rounded-2xl bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
              <div className="h-32 rounded-xl bg-[#EDE5FF]" />
              <h3 className="mt-4 text-base font-semibold leading-snug text-[#33353E]">{post.title}</h3>
              <p className="mt-2 text-sm text-[#666F94]">{post.excerpt}</p>
              <a href="#" className="mt-3 inline-block text-sm font-semibold text-[#7844E4] hover:underline">
                Devamını Oku →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
