import { IconBolt, IconShield, IconUsers } from '@/components/icons'

const TABS = ['7/24 Canlı Destek', 'Güvenli ve Şeffaf Hizmet', 'Hızlı Sonuç, Kalıcı Etki']

const TAB_CONTENT = [
  { icon: IconUsers, title: '7/24 Canlı Destek', text: 'Her siparişte hızlı teslimat, şeffaf takip ve gerçek etkileşim sunuyoruz. Sorun yaşadığınızda ekibimiz anında yanınızda.' },
  { icon: IconShield, title: 'Güvenli ve Şeffaf Hizmet', text: 'Siparişlerinizin her adımını takip edebilir, süreci açık şekilde görebilirsiniz.' },
  { icon: IconBolt, title: 'Hızlı Sonuç, Kalıcı Etki', text: 'Hizmetlerimiz hızlıca başlar ve hesap performansınızı sürdürülebilir şekilde destekler.' },
]

export function SatisfactionSection() {
  return (
    <section className="bg-white py-14">
      <div className="sd-container">
        <p className="text-center text-sm font-semibold text-[#666F94]">Her siparişte memnuniyet.</p>
        <h2 className="mt-2 text-center text-2xl font-semibold text-[#33353E]">Müşteri Memnuniyeti Önceliğimiz</h2>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* Profil mockup — SD: Yılmaz Kurt */}
          <div className="flex flex-col items-center rounded-2xl bg-[#F0F1F9] p-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#7844E4] text-2xl font-bold text-white">
              YK
            </div>
            <p className="mt-4 text-lg font-semibold text-[#33353E]">Yılmaz Kurt</p>
            <p className="text-sm text-[#666F94]">ProMedia Kullanıcısı</p>
            <div className="mt-6 w-full rounded-xl bg-white p-4 text-center">
              <p className="text-sm text-[#666F94]">Takipçi</p>
              <p className="text-3xl font-bold text-[#7844E4]">↑ 126.492</p>
              <p className="mt-1 text-xs text-[#7A7F99]">Yeni takipçilerini keşfet ve incele.</p>
            </div>
          </div>

          {/* Tab içerikleri */}
          <div className="space-y-4">
            {TAB_CONTENT.map((tab, i) => {
              const Icon = tab.icon
              return (
                <div key={tab.title} className="rounded-2xl border border-[#E9EBF5] bg-[#FBFDFF] p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EDE5FF] text-[#7844E4]">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-[#33353E]">{TABS[i]}</p>
                      <p className="mt-1 text-sm leading-relaxed text-[#666F94]">{tab.text}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
