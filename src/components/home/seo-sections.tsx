import Link from 'next/link'

const SERVICES = [
  { title: 'Instagram Büyüme Hizmeti', text: 'Instagram takipçi, beğeni ve izlenme paketleriyle hesabınızın keşfedilebilirliğini güçlendirin.', href: '/instagram-takipci-satin-al', color: '#E1306C' },
  { title: 'TikTok Paketlerini Keşfet', text: 'TikTok izlenme, beğeni ve takipçi destekleriyle videolarınızı keşfete taşıyın.', href: '/tiktok-takipci-satin-al', color: '#000' },
  { title: 'Twitter Paketlerini İncele', text: 'Takipçi, beğeni ve retweet paketleriyle Twitter etkileşiminizi artırın.', href: '/twitter-takipci-satin-al', color: '#1DA1F2' },
  { title: 'YouTube Paketlerini Keşfet', text: 'YouTube izlenme ve etkileşim paketleriyle videolarınızı daha fazla kullanıcıya ulaştırın.', href: '/youtube-abone-satin-al', color: '#FF0000' },
]

export function SeoSections() {
  return (
    <section className="py-12">
      <div className="sd-container">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#33353E]">Popüler Sosyal Medya Hizmetleri</h2>
          <p className="mt-1 text-sm text-[#666F94]">En çok tercih edilen sosyal medya paketleriyle hesabınızın görünürlüğünü artırın.</p>
        </div>

        <div className="mt-8 space-y-6">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className={`grid items-center gap-6 rounded-2xl bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] md:grid-cols-2 ${i % 2 === 1 ? 'md:[direction:rtl]' : ''}`}
            >
              <div className={i % 2 === 1 ? 'md:[direction:ltr]' : ''}>
                <h3 className="text-xl font-semibold text-[#33353E]">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#666F94]">{s.text}</p>
                <Link href={s.href} className="mt-3 inline-block text-sm font-semibold text-[#7844E4] hover:underline">
                  Keşfet →
                </Link>
              </div>
              <div
                className={`flex h-36 items-center justify-center rounded-2xl ${i % 2 === 1 ? 'md:[direction:ltr]' : ''}`}
                style={{ backgroundColor: `${s.color}15` }}
              >
                <div className="h-16 w-16 rounded-2xl" style={{ backgroundColor: s.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
