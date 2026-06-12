import Image from 'next/image'
import { REVIEWERS } from '@/lib/site-people'
import { IconBolt, IconShield, IconUsers } from '@/components/icons'
import { FadeIn } from '@/components/ui/fade-in'

const TABS = ['7/24 Canlı Destek', 'Güvenli ve Şeffaf Hizmet', 'Hızlı Sonuç, Kalıcı Etki']

const TAB_CONTENT = [
  { icon: IconUsers, title: '7/24 Canlı Destek', text: 'Her siparişte hızlı teslimat, şeffaf takip ve gerçek etkileşim sunuyoruz. Sorun yaşadığınızda ekibimiz anında yanınızda.' },
  { icon: IconShield, title: 'Güvenli ve Şeffaf Hizmet', text: 'Siparişlerinizin her adımını takip edebilir, süreci açık şekilde görebilirsiniz.' },
  { icon: IconBolt, title: 'Hızlı Sonuç, Kalıcı Etki', text: 'Hizmetlerimiz hızlıca başlar ve hesap performansınızı sürdürülebilir şekilde destekler.' },
]

const FEATURED = REVIEWERS[0]

export function SatisfactionSection() {
  return (
    <section className="bg-gradient-to-b from-white to-[#F0F1F9] py-14">
      <div className="sd-container">
        <FadeIn>
          <p className="text-center text-sm font-semibold text-[#666F94]">Her siparişte memnuniyet.</p>
          <h2 className="mt-2 text-center text-2xl font-black text-[#33353E] lg:text-3xl">
            Müşteri Memnuniyeti <span className="text-[#7844E4]">Önceliğimiz</span>
          </h2>
        </FadeIn>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <FadeIn direction="right" delay={80}>
            <div className="sd-card-hover flex flex-col items-center rounded-3xl bg-white p-8 shadow-[0_8px_40px_rgba(120,68,228,0.08)]">
              <div className="relative">
                <Image
                  src={FEATURED.photo}
                  alt={`${FEATURED.name} — ProMedia kullanıcısı`}
                  width={96}
                  height={96}
                  className="sd-person-ring h-24 w-24 rounded-full object-cover"
                />
                <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#10B981] text-xs font-bold text-white">
                  ✓
                </span>
              </div>
              <p className="mt-4 text-lg font-bold text-[#33353E]">{FEATURED.name}</p>
              <p className="text-sm text-[#666F94]">{FEATURED.role}</p>
              <div className="mt-6 w-full rounded-2xl bg-gradient-to-br from-[#EDE5FF] to-white p-5 text-center">
                <p className="text-sm font-semibold text-[#666F94]">Takipçi</p>
                <p className="text-4xl font-black text-[#7844E4]">↑ {FEATURED.followers}</p>
                <p className="mt-1 text-xs text-[#7A7F99]">Yeni takipçilerini keşfet ve incele.</p>
              </div>
            </div>
          </FadeIn>

          <div className="space-y-4">
            {TAB_CONTENT.map((tab, i) => {
              const Icon = tab.icon
              return (
                <FadeIn key={tab.title} delay={120 + i * 80}>
                  <div className="sd-card-hover rounded-2xl border border-[#E4DAFA] bg-white p-5 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EDE5FF] text-[#7844E4]">
                        <Icon size={22} />
                      </div>
                      <div>
                        <p className="font-bold text-[#33353E]">{TABS[i]}</p>
                        <p className="mt-1 text-sm leading-relaxed text-[#666F94]">{tab.text}</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
