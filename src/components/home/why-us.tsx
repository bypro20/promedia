import Link from 'next/link'
import { IconBolt, IconShield, IconUsers } from '@/components/icons'

const FEATURES = [
  { icon: IconUsers, title: 'Uygun Fiyatlar', text: 'Tüm sosyal medya hizmetlerinde kaliteli çözümleri erişilebilir fiyatlarla sunuyoruz. Düzenli kampanyalar ve dönemsel fırsatlarla bütçenize uygun seçenekler bulabilirsiniz.' },
  { icon: IconShield, title: 'Güvenilir Ödeme', text: '3D güvenli ödeme altyapısı ile bilgileriniz şifreli şekilde korunur. Hiçbir hizmetimizde hesap bilgisi talep edilmez.' },
  { icon: IconUsers, title: '7/24 Canlı Destek', text: 'Sipariş öncesi ve sonrasında dilediğiniz zaman 7/24 canlı destek ekibimizle iletişime geçebilirsiniz.' },
  { icon: IconBolt, title: 'Esnek ve Avantajlı Paketler', text: 'İhtiyacınıza göre şekillenen paket seçenekleriyle hedeflerinize uygun hizmeti kolayca seçebilirsiniz.' },
  { icon: IconBolt, title: 'Hızlı Teslimat', text: 'Siparişler 0–15 dakika içinde başlar. Büyük paketler kademeli tamamlanır.' },
  { icon: IconShield, title: 'Telafi Garantisi', text: 'Standart 30 gün, Gerçek VIP 90 gün telafi hakkı. Düşüşte telafi talebi oluşturmanız yeterli.' },
]

export function WhyUs() {
  return (
    <section className="bg-[#F0F1F9] py-14">
      <div className="sd-container">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#33353E]">
            Takipçi Satın Almak için <span className="text-[#7844E4]">Neden Biz?</span>
          </h2>
          <p className="mt-1 text-sm text-[#666F94]">Diğer hizmet sağlayanlardan farklarımız, iddaalıyız.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.title} className="rounded-2xl bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDE5FF] text-[#7844E4]">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 font-semibold text-[#33353E]">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#666F94]">{f.text}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
