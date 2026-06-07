const REVIEWS = [
  { name: 'Gökhan T.', role: 'Kişisel Hesap', text: 'Paketleri kullandığımdan beri etkileşim oranımda önemli bir artış oldu. Takipçiler gerçek olmasının yanında etkileşim de sağlıyorlar.' },
  { name: 'Hülya T.', role: 'Influencer', text: 'Hızlı teslimat ve telafi garantisi gerçekten işe yarıyor. ProMedia\'yı güvenle tavsiye ederim.' },
  { name: 'Oğulcan İ.', role: 'Marka Hesabı', text: 'Premium paket ile organik büyüme elde ettim. Destek ekibi 7/24 yardımcı oluyor.' },
  { name: 'Seda S.', role: 'E-ticaret', text: 'Instagram ve TikTok paketlerini birlikte kullandım. Her ikisi de sorunsuz teslim edildi.' },
]

export function Testimonials() {
  return (
    <section className="border-y border-purple-light bg-purple-light/30 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-center text-2xl font-black">Markamıza Güvenen Müşteriler</h2>
        <p className="mt-1 text-center text-sm text-muted">Söz bizde değil, bizi tercih edenlerde!</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((r) => (
            <div key={r.name} className="sd-card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple to-pink text-sm font-black text-white">
                  {r.name[0]}
                </div>
                <div>
                  <p className="font-bold text-sm">{r.name}</p>
                  <p className="text-xs text-muted">{r.role}</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{r.text}</p>
              <div className="mt-2 text-orange text-sm">★★★★★</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
