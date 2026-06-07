import Link from 'next/link'
import { IconBolt, IconShield, IconUsers } from '@/components/icons'

const BLOCKS = [
  {
    tag: 'Hakkımızda',
    title: 'Bizi yakından tanıyın.',
    text: 'ProMedia olarak markaların sosyal medyada daha görünür, daha güçlü ve daha etkili olmasına yardımcı oluyoruz. Takipçi, beğeni, izlenme ve etkileşim hizmetlerinde güvenilir ve hızlı çözümler sunuyoruz.',
    href: '/hizmetler',
    cta: 'Bizi yakından tanıyın.',
    icon: IconUsers,
    color: '#7844E4',
  },
  {
    tag: 'Hızlı Teslimat',
    title: 'Güvenli ve hızlı hizmet.',
    text: 'Hizmet süreçlerinizi anlık takip edin, kısa süre içinde sonuç alın. Gelişmiş altyapımız sayesinde seçtiğiniz hizmetler hızla işleme alınır ve süreç boyunca şeffaf şekilde bilgilendirilirsiniz.',
    href: '/instagram-takipci-satin-al',
    cta: 'Güvenli ve hızlı hizmet.',
    icon: IconBolt,
    color: '#057EF6',
  },
  {
    tag: 'Destek',
    title: 'Sorun mu var? Destek al.',
    text: 'Canlı destek ekibimiz her adımda yanında. Sipariş öncesi veya sonrası aklınıza takılan her konuda hızlıca yardımcı oluyoruz.',
    href: '/siparis-sorgula',
    cta: 'Sorun mu var? Destek al.',
    icon: IconShield,
    color: '#FD5501',
  },
]

export function AboutSection() {
  return (
    <section className="py-12">
      <div className="sd-container space-y-8">
        {BLOCKS.map((block, i) => {
          const Icon = block.icon
          return (
            <div
              key={block.title}
              className={`grid items-center gap-8 rounded-2xl bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] md:grid-cols-2 ${i % 2 === 1 ? 'md:[direction:rtl]' : ''}`}
            >
              <div className={i % 2 === 1 ? 'md:[direction:ltr]' : ''}>
                <span className="text-sm font-semibold" style={{ color: block.color }}>{block.tag}</span>
                <h2 className="mt-2 text-2xl font-semibold text-[#33353E]">{block.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[#666F94]">{block.text}</p>
                <Link href={block.href} className="mt-4 inline-block text-sm font-semibold text-[#7844E4] hover:underline">
                  {block.cta} →
                </Link>
              </div>
              <div className={`flex h-48 items-center justify-center rounded-2xl bg-[#F0F1F9] ${i % 2 === 1 ? 'md:[direction:ltr]' : ''}`}>
                <span style={{ color: block.color }} className="opacity-60">
                  <Icon size={64} />
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
