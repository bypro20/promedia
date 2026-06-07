type Props = { platform: string; unit: string }

export function SeoBlocks({ platform, unit }: Props) {
  const blocks = [
    {
      title: `${platform} ${unit} Hizmeti ProMedia'da!`,
      text: `ProMedia'nın ${platform} ${unit} satın al hizmetleriyle hesabınızı hızlı büyütün. Ucuz paketler, yüksek etkileşim, 7/24 canlı destek ve güvenli 3D ödeme sistemi ile öne çıkıyoruz.`,
    },
    {
      title: 'Hızlı & Güvenli Teslimat',
      text: 'Sipariş sonrası 0–15 dakika içinde teslimata başlanır. Büyük paketler güvenli şekilde kademeli tamamlanır. Şifre paylaşmanıza gerek yoktur.',
    },
    {
      title: 'Telafi Garantisi',
      text: 'Standart paketlerde 30 gün, Gerçek VIP paketlerde 90 gün telafi garantisi. Düşüş yaşarsanız telafi talebi oluşturmanız yeterli.',
    },
  ]

  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6">
        {blocks.map((b, i) => (
          <div key={b.title} className={`grid items-center gap-6 md:grid-cols-2 ${i % 2 === 1 ? 'md:[direction:rtl]' : ''}`}>
            <div className={i % 2 === 1 ? 'md:[direction:ltr]' : ''}>
              <h2 className="text-xl font-black">{b.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{b.text}</p>
            </div>
            <div className={`flex h-32 items-center justify-center rounded-2xl bg-gradient-to-br from-purple/10 to-pink/10 ${i % 2 === 1 ? 'md:[direction:ltr]' : ''}`}>
              <span className="text-5xl">{['🚀', '⚡', '🛡️'][i]}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
