import Link from 'next/link'
import { PLATFORM_SERVICES } from '@/lib/catalog'

const KURUMSAL = [
  { label: 'Hakkımızda', href: '#' },
  { label: 'İade Koşulları', href: '#' },
  { label: 'Kullanım Sözleşmesi', href: '#' },
  { label: 'İletişim', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'KVKK', href: '#' },
]

export function Footer() {
  return (
    <footer className="mt-auto bg-[#1a1033] text-white">
      {/* İletişim bandı */}
      <div className="border-b border-white/10 bg-[#5521c9] py-8">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <p className="text-lg font-black">Bize Ulaşın!</p>
          <p className="mt-2 text-sm text-white/80">
            Her türlü soru, talep ve destek ihtiyacınız için bizimle iletişime geçebilirsiniz.
            Uzman destek ekibimiz <strong>7/24</strong> hazır.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm font-semibold">
            <a href="mailto:destek@promedia.com.tr" className="rounded-full bg-white/10 px-5 py-2 hover:bg-white/20">E-Posta</a>
            <a href="#" className="rounded-full bg-white/10 px-5 py-2 hover:bg-white/20">WhatsApp</a>
            <Link href="/siparis-sorgula" className="rounded-full bg-white/10 px-5 py-2 hover:bg-white/20">Sipariş Sorgula</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-2xl font-black">Pro<span className="text-pink-400">Media</span></p>
            <p className="mt-2 text-sm text-white/60 leading-relaxed">
              Sosyal medyada hızlı ve akıllı büyüme. Güvenli altyapı, hız ve hesap güvenliği odaklı hizmet.
            </p>
          </div>

          <div>
            <p className="font-black text-sm uppercase tracking-wider text-white/50">Hızlı Servisler</p>
            <ul className="mt-3 space-y-1.5 text-sm text-white/70">
              {PLATFORM_SERVICES.slice(0, 8).map((g) => (
                <li key={g.platform}>
                  <Link href={g.items[0]?.href ?? '/hizmetler'} className="hover:text-pink-300">{g.platform}</Link>
                </li>
              ))}
              <li><Link href="/hizmetler" className="font-bold text-purple-300 hover:text-pink-300">Tümünü Gör →</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-black text-sm uppercase tracking-wider text-white/50">Kurumsal</p>
            <ul className="mt-3 space-y-1.5 text-sm text-white/70">
              {KURUMSAL.map((k) => (
                <li key={k.label}><Link href={k.href} className="hover:text-pink-300">{k.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-black text-sm uppercase tracking-wider text-white/50">Destek</p>
            <ul className="mt-3 space-y-1.5 text-sm text-white/70">
              <li><Link href="/siparis-sorgula" className="hover:text-pink-300">Sipariş Sorgula</Link></li>
              <li><Link href="/telafi-talebi" className="hover:text-pink-300">Telafi Talebi</Link></li>
              <li><Link href="/hizmetler" className="hover:text-pink-300">Tüm Hizmetler</Link></li>
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
