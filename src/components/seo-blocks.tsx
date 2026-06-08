type Props = { platform: string; unit: string; platformColor?: string }

export function SeoBlocks({ platform, unit, platformColor = '#7844E4' }: Props) {
  const blocks = [
    {
      title: `${platform} ${unit} Hizmeti ProMedia'da!`,
      text: `ProMedia'nın ${platform} ${unit} hizmetleriyle hesabınızı hızlı büyütün. Ucuz Global, Standart, Premium ve Gerçek VIP paket seçenekleri.`,
      color: platformColor,
    },
    {
      title: 'Ucuz Global Paketler',
      text: 'Bütçe dostu Ucuz Global paketlerimizle en düşük fiyatlarla takipçi, beğeni ve izlenme satın alın. Anında başlangıç, 15 gün garanti.',
      color: '#10B981',
    },
    {
      title: 'Telafi Garantisi',
      text: 'Standart paketlerde 30 gün, Gerçek VIP paketlerde 90 gün telafi garantisi. Düşüş yaşarsanız telafi talebi oluşturmanız yeterli.',
      color: '#FD5501',
    },
  ]

  return (
    <section className="bg-[#F0F1F9] py-12">
      <div className="sd-container space-y-6">
        {blocks.map((b, i) => (
          <div key={b.title} className={`grid items-center gap-6 rounded-2xl bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] md:grid-cols-2 ${i % 2 === 1 ? 'md:[direction:rtl]' : ''}`}>
            <div className={i % 2 === 1 ? 'md:[direction:ltr]' : ''}>
              <h2 className="text-xl font-black text-[#33353E]">{b.title}</h2>
              <p className="mt-2 text-sm font-medium leading-relaxed text-[#666F94]">{b.text}</p>
            </div>
            <div
              className={`flex h-32 items-center justify-center rounded-2xl ${i % 2 === 1 ? 'md:[direction:ltr]' : ''}`}
              style={{ backgroundColor: `${b.color}18` }}
            >
              <div className="h-16 w-16 rounded-2xl shadow-lg" style={{ backgroundColor: b.color }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
