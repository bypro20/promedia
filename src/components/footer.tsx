import Link from 'next/link'
import { PLATFORM_SERVICES } from '@/lib/catalog'

const KURUMSAL = [
  { label: 'Hakkımızda', href: '#' },
  { label: 'İade Koşulları', href: '#' },
  { label: 'Kullanım Sözleşmesi', href: '#' },
  { label: 'İletişim', href: '#' },
  { label: 'Blog', href: '/blog' },
  { label: 'KVKK', href: '#' },
]

export function Footer() {
  return (
    <footer className="mt-auto bg-[#171A26] text-white">
      <div className="border-b border-white/10 bg-[#7844E4] py-8">
        <div className="sd-container text-center">
          <p className="text-lg font-semibold">Bize Ulaşın!</p>
          <p className="mt-2 text-sm text-white/80">
            Her türlü soru, talep ve destek ihtiyacınız için bizimle iletişime geçebilirsiniz.
            Uzman destek ekibimiz <strong>7/24</strong> hazır.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm font-semibold">
            <a href="mailto:destek@promedia.com.tr" className="rounded-full bg-white/10 px-5 py-2 hover:bg-white/20">E-Posta</a>
            <a href="#" className="rounded-full bg-white/10 px-5 py-2 hover:bg-white/20">WhatsApp</a>
            <Link href="/siparis-sorgula" className="rounded-full bg-white/10 px-5 py-2 hover:bg-white/20">Sipariş Sorgula</Link>
          </div>
        </div>
      </div>

      <div className="sd-container py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xl font-bold">Pro<span className="text-[#BFA0FF]">Media</span></p>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              Sosyal medyada hızlı ve akıllı büyüme. Güvenli altyapı, hız ve hesap güvenliği odaklı hizmet.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white/50">Hızlı Servisler</p>
            <ul className="mt-3 space-y-1.5 text-sm text-white/70">
              {PLATFORM_SERVICES.slice(0, 8).map((g) => (
                <li key={g.platform}>
                  <Link href={g.items[0]?.href ?? '/hizmetler'} className="hover:text-[#BFA0FF]">{g.platform}</Link>
                </li>
              ))}
              <li><Link href="/hizmetler" className="font-semibold text-[#BFA0FF] hover:underline">Tümünü Gör →</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white/50">Kurumsal</p>
            <ul className="mt-3 space-y-1.5 text-sm text-white/70">
              {KURUMSAL.map((k) => (
                <li key={k.label}><Link href={k.href} className="hover:text-[#BFA0FF]">{k.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white/50">Destek</p>
            <ul className="mt-3 space-y-1.5 text-sm text-white/70">
              <li><Link href="/siparis-sorgula" className="hover:text-[#BFA0FF]">Sipariş Sorgula</Link></li>
              <li><Link href="/telafi-talebi" className="hover:text-[#BFA0FF]">Telafi Talebi</Link></li>
              <li><Link href="/hizmetler" className="hover:text-[#BFA0FF]">Tüm Hizmetler</Link></li>
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          ProMedia 2024–{new Date().getFullYear()} © Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  )
}
