import Link from 'next/link'

const services = [
  {
    name: 'Instagram Takipçi',
    desc: 'Profilinizi hızlı ve güvenli şekilde büyütün.',
    href: '/instagram-takipci-satin-al',
    icon: '📸',
  },
  {
    name: 'Instagram Beğeni',
    desc: 'Gönderilerinizin etkileşimini artırın.',
    href: '#',
    icon: '❤️',
  },
  {
    name: 'TikTok Takipçi',
    desc: 'TikTok hesabınızı geniş kitlelere ulaştırın.',
    href: '#',
    icon: '🎵',
  },
  {
    name: 'YouTube Abone',
    desc: 'Kanalınızın abone sayısını yükseltin.',
    href: '#',
    icon: '▶️',
  },
]

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-accent">ProMedia</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Sosyal medyada
            <br />
            <span className="text-muted">profesyonel büyüme</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Instagram, TikTok ve YouTube için takipçi, beğeni ve izlenme hizmetleri.
            Şifre istemiyoruz, 3D Secure ödeme, hızlı teslimat.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/instagram-takipci-satin-al"
              className="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Instagram Takipçi Al
            </Link>
            <Link
              href="/siparis-sorgula"
              className="rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium transition-colors hover:border-accent/30"
            >
              Sipariş Sorgula
            </Link>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4 sm:px-6">
          {[
            { label: 'Hızlı teslimat', sub: '0–15 dk başlangıç' },
            { label: 'Güvenli ödeme', sub: '3D Secure' },
            { label: 'Telafi garantisi', sub: '30–90 gün' },
            { label: '7/24 destek', sub: 'Canlı yardım' },
          ].map((item) => (
            <div key={item.label} className="text-center sm:text-left">
              <p className="text-sm font-medium">{item.label}</p>
              <p className="mt-0.5 text-xs text-muted">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight">Hizmetler</h2>
        <p className="mt-2 text-muted">İhtiyacınıza uygun paketi seçin.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <Link
              key={s.name}
              href={s.href}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-accent/30 hover:shadow-sm"
            >
              <span className="text-2xl">{s.icon}</span>
              <p className="mt-4 font-medium group-hover:text-accent">{s.name}</p>
              <p className="mt-1 text-sm text-muted">{s.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
