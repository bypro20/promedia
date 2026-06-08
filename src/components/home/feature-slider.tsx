import Link from 'next/link'
import { ScrollRow } from '@/components/ui/scroll-row'

const FEATURES = [
  { title: 'Takipçi Desteğiyle Hesabınızı Büyütün', text: 'Güvenli takipçi paketleriyle sosyal medyada görünürlüğünüzü artırın.', href: '/instagram-takipci-satin-al', color: '#7844E4' },
  { title: 'Beğeni Paketleriyle Etkileşimi Artır', text: 'Paylaşımlarınız daha fazla etkileşim alsın.', href: '/instagram-begeni-satin-al', color: '#E1306C' },
  { title: 'İzlenme Desteğiyle Daha Fazla Görünürlük', text: 'Video izlenmelerini artır ve keşfete düş.', href: '/instagram-izlenme-satin-al', color: '#057EF6' },
  { title: 'Yorum Desteğiyle Güven Algısı Oluştur', text: 'Gerçek yorumlar ile etkileşim odaklı güçlen.', href: '/instagram-yorum-satin-al', color: '#FD5501' },
  { title: 'Kaydetme ve Paylaşım ile Keşfete Düş', text: 'İçerikleriniz daha fazla kişiye ulaşsın.', href: '/instagram-kaydetme-satin-al', color: '#10B981' },
]

export function FeatureSlider() {
  return (
    <section className="overflow-hidden py-12">
      <div className="sd-container">
        <ScrollRow desktopGrid="lg:grid-cols-3 xl:grid-cols-5">
          {FEATURES.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="flex min-w-[260px] flex-col rounded-2xl bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.05)] transition-transform hover:scale-[1.02] lg:min-w-0"
            >
              <div className="h-1 w-12 rounded-full" style={{ backgroundColor: f.color }} />
              <h3 className="mt-4 text-base font-semibold leading-snug text-[#33353E]">{f.title}</h3>
              <p className="mt-2 text-sm text-[#666F94]">{f.text}</p>
              <span className="mt-4 text-sm font-semibold text-[#7844E4]">Keşfet →</span>
            </Link>
          ))}
        </ScrollRow>
      </div>
    </section>
  )
}
