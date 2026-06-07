import Link from 'next/link'
import { PLATFORM_SERVICES } from '@/lib/catalog'
import { TopBar } from './top-bar'

export function Header() {
  return (
    <>
      <TopBar />
      <header className="sticky top-0 z-50 border-b border-purple-light bg-white shadow-sm">
        <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple to-pink text-sm font-black text-white shadow-md">
              PM
            </span>
            <span className="text-xl font-black">
              Pro<span className="gradient-text">Media</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-5 lg:flex">
            <Link href="/" className="text-sm font-semibold hover:text-purple">Ana Sayfa</Link>
            <Link href="/hizmetler" className="text-sm font-semibold hover:text-purple">Hizmetler</Link>

            {/* Mega menü */}
            <div className="group relative">
              <button type="button" className="flex items-center gap-1 text-sm font-semibold hover:text-purple">
                Kategoriler
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="invisible absolute left-1/2 top-full z-50 w-[780px] -translate-x-1/2 pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                <div className="grid grid-cols-3 gap-4 rounded-2xl border border-purple-light bg-white p-5 shadow-2xl">
                  {PLATFORM_SERVICES.map((group) => (
                    <div key={group.platform}>
                      <p className={`mb-2 flex items-center gap-1.5 bg-gradient-to-r ${group.color} bg-clip-text text-sm font-black text-transparent`}>
                        <span>{group.icon}</span> {group.platform}
                      </p>
                      <ul className="space-y-0.5">
                        {group.items.slice(0, 6).map((s) => (
                          <li key={s.href}>
                            <Link href={s.href} className="block rounded-lg px-2 py-1 text-xs text-muted hover:bg-purple-light hover:text-purple">
                              {s.name}
                            </Link>
                          </li>
                        ))}
                        {group.items.length > 6 && (
                          <li>
                            <Link href="/hizmetler" className="block px-2 py-1 text-xs font-bold text-purple">
                              Tümünü gör →
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/siparis-sorgula" className="text-sm font-semibold hover:text-purple">Sipariş Sorgula</Link>
            <Link href="/telafi-talebi" className="text-sm font-semibold hover:text-purple">Telafi Talebi</Link>
          </nav>

          <Link href="/instagram-takipci-satin-al" className="gradient-btn hidden rounded-full px-5 py-2.5 text-sm font-bold text-white sm:inline-flex">
            Sipariş Ver
          </Link>
        </div>
      </header>
    </>
  )
}
