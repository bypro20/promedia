import Link from 'next/link'
import { IconBolt, IconShield, IconUsers } from '@/components/icons'
import { FadeIn } from '@/components/ui/fade-in'

const BLOCKS = [
  {
    tag: 'Hakkımızda',
    title: 'Bizi yakından tanıyın.',
    text: 'ProMedia olarak markaların sosyal medyada daha görünür, daha güçlü ve daha etkili olmasına yardımcı oluyoruz. Takipçi, beğeni, izlenme ve etkileşim hizmetlerinde güvenilir ve hızlı çözümler sunuyoruz.',
    href: '/hakkimizda',
    cta: 'Bizi yakından tanıyın.',
    icon: IconUsers,
    color: '#7844E4',
  },
  {
    tag: 'Hızlı Teslimat',
    title: 'Güvenli ve hızlı hizmet.',
    text: 'Hizmet süreçlerinizi anlık takip edin, kısa süre içinde sonuç alın. Gelişmiş altyapımız sayesinde seçtiğiniz hizmetler hızla işleme alınır ve süreç boyunca şeffaf şekilde bilgilendirilirsiniz.',
    href: '/siparis-sorgula',
    cta: 'Güvenli ve hızlı hizmet.',
    icon: IconBolt,
    color: '#057EF6',
  },
  {
    tag: 'Destek',
    title: 'Sorun mu var? Destek al.',
    text: 'Canlı destek ekibimiz her adımda yanında. Sipariş öncesi veya sonrası aklınıza takılan her konuda hızlıca yardımcı oluyoruz.',
    href: '/iletisim',
    cta: 'Sorun mu var? Destek al.',
    icon: IconShield,
    color: '#FD5501',
  },
]

export function AboutSection() {
  return (
    <section className="py-14" style={{ background: 'linear-gradient(180deg,#F0F1F9 0%,#FFFFFF 100%)' }}>
      <div className="sd-container">
        <FadeIn>
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-wider text-[#7844E4]">ProMedia</span>
            <h2 className="mt-2 text-[26px] font-black text-[#33353E] lg:text-[32px]">
              Neden <span className="text-[#7844E4]">Bizi Tercih Etmelisiniz?</span>
            </h2>
          </div>
        </FadeIn>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {BLOCKS.map((block, i) => {
            const Icon = block.icon
            return (
              <FadeIn key={block.title} delay={i * 80}>
                <div className="sd-card-hover flex h-full flex-col rounded-2xl border border-[#E4DAFA]/60 bg-white p-6 shadow-[0_4px_24px_rgba(120,68,228,0.06)]">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${block.color}18`, color: block.color }}
                  >
                    <Icon size={24} />
                  </div>
                  <span className="mt-5 text-xs font-black uppercase tracking-widest" style={{ color: block.color }}>
                    {block.tag}
                  </span>
                  <h3 className="mt-2 text-lg font-black leading-snug text-[#33353E]">{block.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[#666F94]">{block.text}</p>
                  <Link
                    href={block.href}
                    className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[#7844E4] hover:underline"
                  >
                    {block.cta} →
                  </Link>
                </div>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}
