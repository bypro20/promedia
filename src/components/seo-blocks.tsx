type Props = { platform: string; unit: string }

export function SeoBlocks({ platform, unit }: Props) {
  const blocks = [
    {
      title: `${platform} ${unit} Hizmeti ProMedia'da!`,
      text: `ProMedia'nın ${platform} ${unit} satın al hizmetleriyle hesabınızı hızlı büyütün. Ucuz paketler, yüksek etkileşim, 7/24 canlı destek ve güvenli 3D ödeme sistemi ile öne çıkıyoruz.`,
      color: '#7844E4',
    },
    {
      title: 'Hızlı & Güvenli Teslimat',
      text: 'Sipariş sonrası 0–15 dakika içinde teslimata başlanır. Büyük paketler güvenli şekilde kademeli tamamlanır. Şifre paylaşmanıza gerek yoktur.',
      color: '#057EF6',
    },
    {
      title: 'Telafi Garantisi',
      text: 'Standart paketlerde 30 gün, Gerçek VIP paketlerde 90 gün telafi garantisi. Düşüş yaşarsanız telafi talebi oluşturmanız yeterli.',
      color: '#10B981',
    },
  ]

  return (
    <section className="bg-[#F0F1F9] py-12">
      <div className="sd-container space-y-6">
        {blocks.map((b, i) => (
          <div key={b.title} className={`grid items-center gap-6 rounded-2xl bg-white p-6 md:grid-cols-2 ${i % 2 === 1 ? 'md:[direction:rtl]' : ''}`}>
            <div className={i % 2 === 1 ? 'md:[direction:ltr]' : ''}>
              <h2 className="text-xl font-semibold text-[#33353E]">{b.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#666F94]">{b.text}</p>
            </div>
            <div
              className={`flex h-32 items-center justify-center rounded-2xl ${i % 2 === 1 ? 'md:[direction:ltr]' : ''}`}
              style={{ backgroundColor: `${b.color}15` }}
            >
              <div className="h-14 w-14 rounded-2xl" style={{ backgroundColor: b.color }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
