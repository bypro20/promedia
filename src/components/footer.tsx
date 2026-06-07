import Link from 'next/link'
import { PLATFORM_SERVICES } from '@/lib/catalog'

export function Footer() {
  return (
    <footer className="mt-auto bg-purple-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xl font-black">Pro<span className="text-pink-300">Media</span></p>
            <p className="mt-2 text-sm text-white/70 leading-relaxed">
              Sosyal medya büyüme hizmetleri. Güvenli ödeme, hızlı teslimat, 7/24 destek.
            </p>
          </div>
          {PLATFORM_SERVICES.slice(0, 3).map((g) => (
            <div key={g.platform}>
              <p className="font-bold">{g.platform}</p>
              <ul className="mt-3 space-y-1.5 text-sm text-white/70">
                {g.items.slice(0, 4).map((s) => (
                  <li key={s.href}>
                    <Link href={s.href} className="hover:text-pink-300">{s.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-4 border-t border-white/10 pt-6 text-xs text-white/50">
          <Link href="/siparis-sorgula" className="hover:text-white">Sipariş Sorgula</Link>
          <Link href="/telafi-talebi" className="hover:text-white">Telafi Talebi</Link>
          <Link href="/hizmetler" className="hover:text-white">Hizmetler</Link>
          <span>© {new Date().getFullYear()} ProMedia. Tüm hakları saklıdır.</span>
        </div>
      </div>
    </footer>
  )
}
