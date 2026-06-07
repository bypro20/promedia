const FEATURES = [
  { icon: '💰', title: 'Uygun Fiyatlar', text: 'Kaliteli çözümleri erişilebilir fiyatlarla sunuyoruz. Düzenli kampanyalar ve dönemsel fırsatlar.' },
  { icon: '🔒', title: 'Güvenilir Ödeme', text: '3D güvenli ödeme altyapısı. Hiçbir hizmetimizde şifre talep edilmez.' },
  { icon: '💬', title: '7/24 Canlı Destek', text: 'Sipariş öncesi ve sonrasında dilediğiniz zaman destek ekibimize ulaşın.' },
  { icon: '📦', title: 'Esnek Paketler', text: 'İhtiyacınıza göre şekillenen paket seçenekleri. 100\'den 100K\'ya kadar.' },
  { icon: '⚡', title: 'Hızlı Teslimat', text: 'Siparişler 0–15 dakika içinde başlar. Büyük paketler kademeli tamamlanır.' },
  { icon: '🛡️', title: 'Telafi Garantisi', text: 'Standart 30 gün, Gerçek VIP 90 gün telafi hakkı. Düşüşte telafi talebi.' },
]

export function WhyUs() {
  return (
    <section className="bg-purple-light/40 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-center text-2xl font-black sm:text-3xl">
          Takipçi Satın Almak için <span className="gradient-text">Neden Biz?</span>
        </h2>
        <p className="mt-1 text-center text-muted">Diğer hizmet sağlayanlardan farklarımız</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="sd-card p-6">
              <span className="text-3xl">{f.icon}</span>
              <h3 className="mt-3 font-black">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
