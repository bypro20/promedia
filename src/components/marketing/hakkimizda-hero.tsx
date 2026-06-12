import Link from 'next/link'
import { FadeIn } from '@/components/ui/fade-in'

const STATS = [
  { value: '7/24', label: 'Canlı Destek' },
  { value: '%100', label: 'Güvenli Ödeme' },
  { value: '15 dk', label: 'Ort. Başlangıç' },
  { value: '300+', label: 'Aktif Hizmet' },
]

export function HakkimizdaHero() {
  return (
    <>
      <section className="sd-gradient-hero overflow-hidden py-14 lg:py-20">
        <div className="sd-container">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <FadeIn direction="right">
              <span className="text-sm font-bold uppercase tracking-wider text-[#7844E4]">Hakkımızda</span>
              <h1 className="mt-3 text-3xl font-black leading-tight text-[#33353E] lg:text-[42px]">
                Bizi <span className="text-[#7844E4]">yakından tanıyın.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#666F94]">
                ProMedia olarak markaların sosyal medyada daha görünür, daha güçlü ve daha etkili olmasına
                yardımcı oluyoruz. Takipçi, beğeni, izlenme ve etkileşim hizmetlerinde güvenilir ve hızlı
                çözümler sunuyoruz.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/hizmetler"
                  className="rounded-2xl bg-[#7844E4] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#6835d3]"
                >
                  Hizmetleri İncele
                </Link>
                <Link
                  href="/iletisim"
                  className="rounded-2xl border border-[#E4DAFA] bg-white px-6 py-3 text-sm font-bold text-[#33353E] transition-colors hover:border-[#7844E4]"
                >
                  İletişime Geç
                </Link>
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={100}>
              <div className="rounded-3xl border border-[#E4DAFA]/60 bg-white/80 p-8 shadow-[0_8px_32px_rgba(120,68,228,0.08)] backdrop-blur-sm">
                <p className="text-sm font-bold text-[#7844E4]">ProMedia</p>
                <p className="mt-3 text-lg font-black text-[#33353E]">Güvenilir sosyal medya büyüme platformu</p>
                <p className="mt-3 text-sm leading-relaxed text-[#666F94]">
                  Şifre istemeyen sipariş, 7/24 destek, telafi garantisi ve iyzico güvenli ödeme altyapısı.
                </p>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={160}>
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[#E4DAFA]/60 bg-white/80 px-4 py-5 text-center backdrop-blur-sm"
                >
                  <p className="text-2xl font-black text-[#7844E4]">{stat.value}</p>
                  <p className="mt-1 text-xs font-semibold text-[#666F94]">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-12">
        <div className="sd-container text-center">
          <FadeIn>
            <p className="text-sm font-semibold text-[#666F94]">Yönetim</p>
            <p className="mt-2 text-2xl font-black tracking-wide text-[#33353E]">
              By <span className="text-[#7844E4]">UquR</span>
            </p>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
