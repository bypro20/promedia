'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PLATFORM_SERVICES } from '@/lib/catalog'
import { TopBar } from './top-bar'
import { IconBell, IconCart } from './icons'
import { AuthNav } from './auth-nav'

const NAV = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Hizmetler', mega: true },
  { label: 'Organik Büyüme', href: '/instagram-takipci-satin-al' },
  { label: 'Blog', href: '/blog' },
  { label: 'Ücretsiz Araçlar', href: '/ucretsiz-araclar' },
]

/** SD: .main-navbar-section — white, 65px, shadow, sticky below top bar */
export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)

  return (
    <>
      <TopBar />
      <header className="sticky top-[42px] z-[999] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
        <div className="sd-container flex h-[65px] items-center justify-between gap-4">
          {/* Logo — SD: navbar-logo.webp 140×34 */}
          <Link href="/" className="shrink-0">
            <span className="flex items-center gap-2">
              <span className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-[#7844E4] text-xs font-bold text-white">
                PM
              </span>
              <span className="text-[22px] font-bold tracking-tight text-[#33353E]">
                Pro<span className="text-[#7844E4]">Media</span>
              </span>
            </span>
          </Link>

          {/* Center nav — SD: 16px, font-weight 600, #33353E */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) =>
              item.mega ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setMegaOpen(true)}
                  onMouseLeave={() => setMegaOpen(false)}
                >
                  <button
                    type="button"
                    className="flex items-center gap-1 rounded-lg px-3 py-2 text-base font-semibold text-[#33353E] hover:text-[#7844E4]"
                  >
                    Hizmetler
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {megaOpen && (
                    <>
                      <div
                        className="fixed inset-0 top-[107px] z-40 bg-black/20"
                        onClick={() => setMegaOpen(false)}
                        aria-hidden
                      />
                      <div className="absolute left-1/2 top-full z-50 w-[min(887px,calc(100vw-2rem))] -translate-x-1/2 pt-2">
                        <div className="rounded-2xl border border-[#E9EBF5] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.15)]">
                          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#7844E4]">
                            En Çok Kullanılan Kategorilerimiz
                          </p>
                          <div className="grid grid-cols-4 gap-5">
                            {PLATFORM_SERVICES.slice(0, 8).map((group) => (
                              <div key={group.platform}>
                                <p className="mb-2 text-sm font-bold text-[#33353E]">{group.platform}</p>
                                <ul className="space-y-0.5">
                                  {group.items.slice(0, 9).map((s) => (
                                    <li key={s.href}>
                                      <Link
                                        href={s.href}
                                        onClick={() => setMegaOpen(false)}
                                        className="block rounded-md px-2 py-1 text-xs text-[#666F94] hover:bg-[#EDE5FF] hover:font-semibold hover:text-[#7844E4]"
                                      >
                                        {s.name.replace(`${group.platform} `, '')}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                                <Link
                                  href="/hizmetler"
                                  onClick={() => setMegaOpen(false)}
                                  className="mt-2 block px-2 text-xs font-bold text-[#7844E4] hover:underline"
                                >
                                  Tümünü Görüntüle
                                </Link>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  className="rounded-lg px-3 py-2 text-base font-semibold text-[#33353E] hover:text-[#7844E4]"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Right — SD: nav-pill icons + Giriş Yap */}
          <div className="flex items-center gap-2">
            <button type="button" className="sd-nav-pill hidden text-[#7844E4] sm:flex" aria-label="Bildirimler">
              <IconBell size={20} />
              <span className="sd-nav-badge">1</span>
            </button>
            <button type="button" className="sd-nav-pill hidden text-[#7844E4] sm:flex" aria-label="Sepet">
              <IconCart size={20} />
              <span className="sd-nav-badge">0</span>
            </button>
            <AuthNav />
            <button
              type="button"
              className="rounded-lg p-2 lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menü"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-[#E9EBF5] bg-white px-4 py-4 lg:hidden">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href ?? '/hizmetler'}
                className="block rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-[#EDE5FF]"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  )
}
