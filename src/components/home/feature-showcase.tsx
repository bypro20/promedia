import Link from 'next/link'

const BLOCKS = [
  { icon: '👥', title: 'Takipçi Desteğiyle Hesabınızı Büyütün', text: 'Güvenli takipçi paketleriyle sosyal medyada görünürlüğünüzü artırın.', href: '/instagram-takipci-satin-al' },
  { icon: '❤️', title: 'Beğeni Paketleriyle Etkileşimi Artır', text: 'Paylaşımlarınız daha fazla etkileşim alsın.', href: '/instagram-begeni-satin-al' },
  { icon: '▶️', title: 'İzlenme Desteğiyle Daha Fazla Görünürlük', text: 'Video izlenmelerini artır ve keşfete düş.', href: '/instagram-izlenme-satin-al' },
  { icon: '💬', title: 'Yorum Desteğiyle Güven Algısı Oluştur', text: 'Gerçek yorumlar ile etkileşim odaklı güçlen.', href: '/instagram-yorum-satin-al' },
  { icon: '🔖', title: 'Kaydetme ve Paylaşım ile Keşfete Düş', text: 'İçerikleriniz daha fazla kişiye ulaşsın.', href: '/instagram-kaydetme-satin-al' },
]

export function FeatureShowcase() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-center text-2xl font-black">Popüler Sosyal Medya Hizmetleri</h2>
        <p className="mt-1 text-center text-muted">En çok tercih edilen paketlerle görünürlüğünüzü artırın</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {BLOCKS.map((b) => (
            <Link key={b.title} href={b.href} className="sd-card group p-5 text-center hover:ring-2 hover:ring-purple/30">
              <span className="text-4xl">{b.icon}</span>
              <h3 className="mt-3 text-sm font-black leading-snug group-hover:text-purple">{b.title}</h3>
              <p className="mt-2 text-xs text-muted">{b.text}</p>
              <span className="mt-3 inline-block text-xs font-bold text-purple">Keşfet →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
