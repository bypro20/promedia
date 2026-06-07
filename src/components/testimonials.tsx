'use client'

import { useState } from 'react'

const REVIEWS = [
  { name: 'Ahmet Yılmaz', role: 'Dijital Pazarlama', avatar: 'AY', count: '1.280', text: 'İşletmemin Instagram hesabını büyütmek için takipçi satın aldım ve gerçekten memnun kaldım. Gelen takipçiler organik görünüyor ve etkileşim oranım arttı.' },
  { name: 'Zeynep Kara', role: 'Influencer', avatar: 'ZK', count: '890', text: 'Premium paket ile keşfete düştüm. Hızlı teslimat ve telafi garantisi gerçekten işe yarıyor.' },
  { name: 'Elif Demir', role: 'E-ticaret', avatar: 'ED', count: '2.100', text: 'Türk takipçi paketi yerel etkileşimimi ciddi artırdı. Destek ekibi anında yardımcı oldu.' },
  { name: 'Emre Can', role: 'Kişisel Hesap', avatar: 'EC', count: '560', text: 'TikTok ve Instagram paketlerini birlikte kullandım. Sorunsuz teslimat, tavsiye ederim.' },
  { name: 'Ahsen Buyruk', role: 'Marka Hesabı', avatar: 'AB', count: '3.400', text: 'ProMedia ile 6 aydır çalışıyorum. Kalıcı VIP paket minimum düşüş sağlıyor.' },
]

export function Testimonials() {
  const [active, setActive] = useState(0)
  const r = REVIEWS[active]

  return (
    <section className="bg-white py-14">
      <div className="sd-container">
        <h2 className="text-center text-2xl font-semibold text-[#33353E]">Markamıza Güvenen Müşteri Yorumları</h2>
        <p className="mt-1 text-center text-sm text-[#666F94]">Söz bizde değil, bizi tercih edenlerde!</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
          <div className="flex flex-row gap-3 overflow-x-auto lg:flex-col lg:overflow-visible">
            {REVIEWS.map((rev, i) => (
              <button
                key={rev.name}
                type="button"
                onClick={() => setActive(i)}
                className={`flex shrink-0 items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-all ${
                  active === i ? 'border-[#7844E4] bg-[#EDE5FF]' : 'border-[#E9EBF5] bg-white hover:border-[#7844E4]/50'
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#7844E4] text-sm font-bold text-white">
                  {rev.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#33353E]">{rev.name}</p>
                  <p className="text-xs text-[#666F94]">{rev.count} kişi bu avatarı kullanıyor</p>
                </div>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-[#E9EBF5] bg-[#FBFDFF] p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#7844E4] text-lg font-bold text-white">
                {r.avatar}
              </div>
              <div>
                <p className="text-[#FD5501] text-lg">★★★★★</p>
                <p className="mt-3 text-base leading-relaxed text-[#33353E]">{r.text}</p>
                <div className="mt-4 border-t border-[#E9EBF5] pt-4">
                  <p className="font-semibold text-[#33353E]">{r.name}</p>
                  <p className="text-sm text-[#666F94]">{r.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
